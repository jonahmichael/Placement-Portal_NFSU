import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Box minH="100vh" bg="white" py={20}>
      <Container maxW="md">
        <Card bg="white" borderWidth="1px" borderColor="gray.200">
          <CardBody>
            <VStack spacing={6} align="center">
              <Heading 
                as="h1" 
                size="2xl" 
                color="black"
                textAlign="center"
                fontWeight="normal"
              >
                NFSU Placement Portal
              </Heading>
              
              <Text fontSize="lg" color="gray.600" textAlign="center">
                College Placement Management System
              </Text>
              
              <Text fontSize="sm" color="gray.500" textAlign="center">
                Welcome to the placement management system
              </Text>

              <VStack spacing={3} width="100%" pt={4}>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="solid"
                  size="lg"
                  width="100%"
                >
                  Student Login
                </Button>

                <Button
                  as={RouterLink}
                  to="/admin"
                  variant="outline"
                  size="lg"
                  width="100%"
                >
                  Admin Dashboard
                </Button>

                <Button
                  as={RouterLink}
                  to="/company"
                  variant="outline"
                  size="lg"
                  width="100%"
                >
                  Company Dashboard
                </Button>

                <Button
                  as={RouterLink}
                  to="/company/register"
                  variant="ghost"
                  size="lg"
                  width="100%"
                  leftIcon={<span>📝</span>}
                >
                  Company Registration
                </Button>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default Home;
