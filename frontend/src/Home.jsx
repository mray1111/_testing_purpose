import React from 'react';
import { Box, Stack } from "@chakra-ui/react";
import Card from './Card';
import axios from "axios";

const Home = () => {

    const checkoutHandler = async (amount, name, email) => {

        const { data: { key } } = await axios.get("http://localhost:4000/api/getkey");
        const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", {
            amount,
            name,
            email
        });
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

        const razor = new window.Razorpay(options);
        razor.open();
    }

    return (
        <Box>
            <Stack h={"100vh"} alignItems="center" justifyContent="center" direction={["column", "row"]}>

                <Card amount={10} img={"https://cdn.shopify.com/s/files/1/1684/4603/products/MacBookPro13_Mid2012_NonRetina_Silver.png"} name="manish001" email="user1@admin.com" checkoutHandler={checkoutHandler} />
                
                <Card amount={20} img={"http://i1.adis.ws/i/canon/eos-r5_front_rf24-105mmf4lisusm_32c26ad194234d42b3cd9e582a21c99b"} name="manish002" email="user2@admin.com" checkoutHandler={checkoutHandler} />
            </Stack>
        </Box>
    );
}

export default Home;
