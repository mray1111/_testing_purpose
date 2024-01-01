import crypto from "crypto";
import { instance } from "../server.js";
import Payment from "../models/paymentModel.js";



export const checkout = async (req, res) => {
  // Extract customer details from the request body
  const { name, email, amount } = req.body;

  // Validate name, email, and amount as needed

  const options = {
    amount: Number(amount * 100),
    currency: "INR",
  };

  try {
    const order = await instance.orders.create(options);

    // Save order details to the database, including name and email
    await Payment.create({
      razorpay_order_id: order.id,
      razorpay_payment_id: null, // This will be updated during payment verification
      razorpay_signature: null, // This will be updated during payment verification
      name,
      email,
    });

    // Handle successful creation of the order
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    // Handle the error in a meaningful way
    console.error("Error creating order:", error);

    // Send an appropriate HTTP response indicating the failure
    res.status(500).json({
      success: false,
      error: "Failed to create order",
    });
  }
};


export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  console.log(razorpay_order_id,razorpay_payment_id,razorpay_signature)


  try {

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const updatedPayment = await Payment.findOneAndUpdate(
        { razorpay_order_id: razorpay_order_id },
        {
          $set: {
            razorpay_payment_id,
            razorpay_signature
          },
        },
        { new: true, upsert: true }
      );
      // return res.status(200).json({
      //   success: true,
      //   error: "True",
      // });

      return res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`);
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid signature",
      });
    }
  } catch (error) {
    console.error("Error during payment verification:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};