import React from 'react';
import { Box, Stack } from "@chakra-ui/react";
import Card from './Card';
import axios from "axios";

const Home = () => {

    const checkoutHandler = async (amount, name, email) => {
        const { data: { key } } = await axios.get("http://localhost:4000/api/getkey");
        console.log("1 key is ",key)
        // Include customer details directly in the axios.post call
        const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", {
            amount,
            name,
            email
        });

        // console.log("2 order  ",order)
        // console.log("3 name is ",name)
        // console.log("4 email is ",email)


        const options = {
            key,
            name:"TEDxPay",
            amount: order.amount,
            currency: "INR",
            description: "TEDx IIT Guwahati",
            image: "pleaseenterimage",
            order_id: order.id,
            callback_url: "http://localhost:4000/api/paymentVerification",
            prefill: {
                name: name,
                email: email,
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#121212"
            }
        };
        console.log(options);
        const razor = new window.Razorpay(options);

        razor.open();
    }

    return (
        <Box>
            <Stack h={"100vh"} alignItems="center" justifyContent="center" direction={["column", "row"]}>
                {/* First Card */}
                <Card amount={10} img={"https://cdn.shopify.com/s/files/1/1684/4603/products/MacBookPro13_Mid2012_NonRetina_Silver.png"} name="manish001" email="user1@admin.com" checkoutHandler={checkoutHandler} />
                
                {/* Second Card */}
                <Card amount={20} img={"http://i1.adis.ws/i/canon/eos-r5_front_rf24-105mmf4lisusm_32c26ad194234d42b3cd9e582a21c99b"} name="manish002" email="user2@admin.com" checkoutHandler={checkoutHandler} />
            </Stack>
        </Box>
    );
}

export default Home;
