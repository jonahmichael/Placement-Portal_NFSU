import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  SimpleGrid,
  Select,
} from '@chakra-ui/react';
import { FiUser, FiLock, FiMail, FiPhone } from 'react-icons/fi';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration form state
  const [regData, setRegData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    rollNumber: '',
    enrollmentNumber: '',
    mobileNumber: '',
    gender: '',
    course: '',
    branch: '',
    currentSemester: '',
    yearOfAdmission: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate passwords match
    if (regData.password !== regData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (regData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: regData.email,
          password: regData.password,
          full_name: regData.fullName,
          roll_number: regData.rollNumber,
          enrollment_number: regData.enrollmentNumber,
          mobile_number: regData.mobileNumber,
          gender: regData.gender,
          course: regData.course,
          branch: regData.branch,
          current_semester: parseInt(regData.currentSemester),
          year_of_admission: parseInt(regData.yearOfAdmission),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Account created successfully! Please login.');
      // Switch to login tab after successful registration
      setTimeout(() => {
        setIsLogin(true);
        setEmail(regData.email);
        setSuccess('');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegInputChange = (field, value) => {
    setRegData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box minH="100vh" bg="white" display="flex" alignItems="center" justifyContent="center" py={8}>
      <Container maxW={isLogin ? "md" : "2xl"}>
        <Card borderWidth="2px" borderColor="black" bg="white" boxShadow="none">
          <CardBody p={8} bg="white">
            <VStack spacing={6} align="stretch">
              <VStack spacing={2}>
                <Heading size="lg" color="black" fontWeight="normal">
                  {isLogin ? 'Student Login' : 'Create Account'}
                </Heading>
                <Text color="black" fontSize="sm">College Placement Management System</Text>
              </VStack>

              {/* Toggle buttons */}
              <HStack spacing={2} justify="center">
                <Button
                  size="sm"
                  variant={isLogin ? "solid" : "outline"}
                  bg={isLogin ? "black" : "white"}
                  color={isLogin ? "white" : "black"}
                  borderColor="black"
                  _hover={{ bg: isLogin ? "gray.700" : "gray.50" }}
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setSuccess('');
                  }}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  variant={!isLogin ? "solid" : "outline"}
                  bg={!isLogin ? "black" : "white"}
                  color={!isLogin ? "white" : "black"}
                  borderColor="black"
                  _hover={{ bg: !isLogin ? "gray.700" : "gray.50" }}
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setSuccess('');
                  }}
                >
                  Create Account
                </Button>
              </HStack>

              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">{error}</Text>
                </Alert>
              )}

              {success && (
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">{success}</Text>
                </Alert>
              )}

              {isLogin ? (
                // Login Form
                <form onSubmit={handleLoginSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel color="black" fontWeight="medium">Email</FormLabel>
                      <Input
                        type="email"
                        placeholder="student@nfsu.ac.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        focusBorderColor="black"
                        borderColor="gray.300"
                        bg="white"
                        color="black"
                        _placeholder={{ color: 'gray.400' }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="black" fontWeight="medium">Password</FormLabel>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        focusBorderColor="black"
                        borderColor="gray.300"
                        bg="white"
                        color="black"
                        _placeholder={{ color: 'gray.400' }}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      width="100%"
                      bg="black"
                      color="white"
                      _hover={{ bg: 'gray.700' }}
                      isLoading={loading}
                      loadingText="Logging in..."
                    >
                      Login
                    </Button>
                  </VStack>
                </form>
              ) : (
                // Registration Form
                <form onSubmit={handleRegisterSubmit}>
                  <VStack spacing={4}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                      <FormControl isRequired>
                        <FormLabel color="black" fontWeight="medium">Full Name</FormLabel>
                        <Input
                          placeholder="Enter your full name"
                          value={regData.fullName}
                          onChange={(e) => handleRegInputChange('fullName', e.target.value)}
                          focusBorderColor="black"
                          borderColor="gray.300"
                          bg="white"
                          color="black"
                          _placeholder={{ color: 'gray.400' }}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="black" fontWeight="medium">Email</FormLabel>
                        <Input
                          type="email"
                          placeholder="student@nfsu.ac.in"
                          value={regData.email}
                          onChange={(e) => handleRegInputChange('email', e.target.value)}
                          focusBorderColor="black"
                          borderColor="gray.300"
                          bg="white"
                          color="black"
                          _placeholder={{ color: 'gray.400' }}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="black" fontWeight="medium">Roll Number</FormLabel>
                        <Input
                          placeholder="e.g., 2021001"
                          value={regData.rollNumber}
                          onChange={(e) => handleRegInputChange('rollNumber', e.target.value)}
                          focusBorderColor="black"
                          borderColor="gray.300"
                          bg="white"
                          color="black"
                          _placeholder={{ color: 'gray.400' }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel color="black" fontWeight="medium">Enrollment Number</FormLabel>
                        <Input
                          placeholder="e.g., NFSU2021001"
                          value={regData.enrollmentNumber}
                          onChange={(e) => handleRegInputChange('enrollmentNumber', e.target.value)}
                          focusBorderColor="black"
                          borderColor="gray.300"
                          bg="white"
                          color="black"
                          _placeholder={{ color: 'gray.400' }}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="black" fontWeight="medium">Mobile Number</FormLabel>
                        <Input
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={regData.mobileNumber}
                          onChange={(e) => handleRegInputChange('mobileNumber', e.target.value)}
                          focusBorderColor="black"
                          borderColor="gray.300"
                          bg="white"
                          color="black"
                          _placeholder={{ color: 'gray.400' }}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="black" fontWeight="medium">Gender</FormLabel>
                        <Select
                          placeholder="Select gender"
                          value={regData.gender}
                          onChange={(e) => handleRegInputChange('gender', e.target.value)}
                          focusBorderColor="black"
                          borderColor="gray.300"
                          bg="white"
                          color="black"
                          _placeholder={{ color: 'gray.400' }}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="black" fontWeight="medium">Course</FormLabel>
                        <Input
                          placeholder="e.g., B.Tech"
                          value={regData.course}
                          onChange={(e) => handleRegInputChange('course', e.target.value)}
                          focusBorderColor="black"
                          borderColor="gray.300"
                          bg="white"
                          color="black"
                          _placeholder={{ color: 'gray.400' }}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="black" fontWeight="medium">Branch</FormLabel>
                        <Input
                          placeholder="e.g., Computer Science"
                          value={regData.branch}
                          onChange={(e) => handleRegInputChange('branch', e.target.value)}
                          focusBorderColor="black"
                          borderColor="gray.300"
                          bg="white"
                          color="black"
                          _placeholder={{ color: 'gray.400' }}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="black" fontWeight="medium">Current Semester</FormLabel>
                        <Select
                          placeholder="Select semester"
                          value={regData.currentSemester}
                          onChange={(e) => handleRegInputChange('currentSemester', e.target.value)}
                          focusBorderColor="black"
                          borderColor="gray.300"
                          bg="white"
                          color="black"
                          _placeholder={{ color: 'gray.400' }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="black" fontWeight="medium">Year of Admission</FormLabel>
                        <Input
                          type="number"
                          placeholder="e.g., 2021"
                          value={regData.yearOfAdmission}
                          onChange={(e) => handleRegInputChange('yearOfAdmission', e.target.value)}
                          focusBorderColor="black"
                          borderColor="gray.300"
                          bg="white"
                          color="black"
                          _placeholder={{ color: 'gray.400' }}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="black" fontWeight="medium">Password</FormLabel>
                        <Input
                          type="password"
                          placeholder="Minimum 6 characters"
                          value={regData.password}
                          onChange={(e) => handleRegInputChange('password', e.target.value)}
                          focusBorderColor="black"
                          borderColor="gray.300"
                          bg="white"
                          color="black"
                          _placeholder={{ color: 'gray.400' }}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="black" fontWeight="medium">Confirm Password</FormLabel>
                        <Input
                          type="password"
                          placeholder="Re-enter password"
                          value={regData.confirmPassword}
                          onChange={(e) => handleRegInputChange('confirmPassword', e.target.value)}
                          focusBorderColor="black"
                          borderColor="gray.300"
                          bg="white"
                          color="black"
                          _placeholder={{ color: 'gray.400' }}
                        />
                      </FormControl>
                    </SimpleGrid>

                    <Button
                      type="submit"
                      width="100%"
                      bg="black"
                      color="white"
                      _hover={{ bg: 'gray.700' }}
                      isLoading={loading}
                      loadingText="Creating account..."
                    >
                      Create Account
                    </Button>
                  </VStack>
                </form>
              )}
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default Login;
