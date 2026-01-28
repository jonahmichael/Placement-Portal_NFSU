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
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor} py={20}>
      <Container maxW="md">
        <Card bg={cardBg} shadow="xl" borderRadius="lg">
          <CardBody>
            <VStack spacing={6} align="center">
              <Heading 
                as="h1" 
                size="2xl" 
                bgGradient="linear(to-r, brand.400, brand.600)"
                bgClip="text"
                textAlign="center"
              >
                NFSU Placement Portal
              </Heading>
              
              <Text fontSize="lg" color="gray.600" textAlign="center">
                College Placement Management System
              </Text>
              
              <Text fontSize="sm" color="gray.500" textAlign="center">
                (Authentication temporarily disabled for testing)
              </Text>

              <VStack spacing={3} width="100%" pt={4}>
                <Button
                  as={RouterLink}
                  to="/admin"
                  colorScheme="purple"
                  size="lg"
                  width="100%"
                  leftIcon={<span>👨‍💼</span>}
                >
                  Admin Dashboard
                </Button>

                <Button
                  as={RouterLink}
                  to="/company"
                  colorScheme="green"
                  size="lg"
                  width="100%"
                  leftIcon={<span>🏢</span>}
                >
                  Company Dashboard
                </Button>

                <Button
                  as={RouterLink}
                  to="/student"
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  leftIcon={<span>🎓</span>}
                >
                  Student Dashboard
                </Button>

                <Button
                  as={RouterLink}
                  to="/company/register"
                  colorScheme="gray"
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
