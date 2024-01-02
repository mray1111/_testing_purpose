import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const searchQuery = useSearchParams()[0];
  const referenceNum = searchQuery.get('reference');
  const email = searchQuery.get('email');
  const name = searchQuery.get('name');

  return (
    <Box>
      <VStack h="100vh" justifyContent="center">
        <Heading textTransform="uppercase">Order Successful</Heading>
        <Text>Name: {name}</Text>
        <Text>Email: {email}</Text>
        <Text>Reference No: {referenceNum}</Text>
      </VStack>
    </Box>
  );
};

export default PaymentSuccess;
