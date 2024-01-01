import { Button, Image, Text, VStack } from '@chakra-ui/react';
import React from 'react';

const Card = ({ amount, img, name, email, checkoutHandler }) => {
  return (
    <VStack>
      <Image src={img} boxSize={"64"} objectFit="cover" />
      <Text>₹{amount}</Text>
      <Text>Name: {name}</Text>
      <Text>Email: {email}</Text>
      <Button onClick={() => checkoutHandler(amount, name, email)}>Buy Now</Button>
    </VStack>
  );
};

export default Card;
