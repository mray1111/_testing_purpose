import crypto from "crypto";
import { instance } from "../server.js";
import Payment from "../models/paymentModel.js";



export const checkout = async (req, res) => {

  const { name, email, amount } = req.body;
  const options = {
    amount: Number(amount * 100),
    currency: "INR",
  };

  try {

    //make sure you are connected with internet if order create fails
    const order = await instance.orders.create(options);

    await Payment.create({
      razorpay_order_id: order.id,
      razorpay_payment_id: null, // This will be updated during payment verification
      razorpay_signature: null, // This will be updated during payment verification
      name,
      email,
    });

    res.status(200).json({
      success: true,
      order,
    });
  }

  catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create order",
    });
  }
};


export const paymentVerification = async (req, res) => {

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
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

      const cust_email = updatedPayment.email;
      const cust_name = updatedPayment.name;
      return res.redirect(`http://localhost:3000/payment_redirect?reference=${razorpay_payment_id}&email=${cust_email}&name=${cust_name}`);

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
