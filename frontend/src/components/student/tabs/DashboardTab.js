import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Heading,
  Text,
  Progress,
  VStack,
  HStack,
  Badge,
  Icon,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { 
  FiCheckCircle, 
  FiAlertCircle, 
  FiClock, 
  FiTrendingUp,
  FiCalendar,
  FiBriefcase,
} from 'react-icons/fi';

function DashboardTab({ studentData, loading }) {
  const cardBg = 'white';
  const borderColor = 'gray.200';

  // Mock data for notifications and deadlines
  const upcomingDeadlines = [
    { company: 'TechCorp Solutions', role: 'Software Engineer', deadline: '2026-02-05', status: 'Applied' },
    { company: 'DataFlow Inc', role: 'Data Analyst', deadline: '2026-02-10', status: 'Eligible' },
    { company: 'CloudNet Systems', role: 'Backend Developer', deadline: '2026-02-15', status: 'Eligible' },
  ];

  const notifications = [
    { id: 1, type: 'info', message: 'New job drive posted: Software Engineer at TechCorp', time: '2 hours ago' },
    { id: 2, type: 'success', message: 'Your profile has been verified by admin', time: '1 day ago' },
    { id: 3, type: 'warning', message: 'Complete your profile to increase visibility', time: '2 days ago' },
  ];

  if (loading) {
    return (
      <Box>
        <Text>Loading dashboard...</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Welcome Message */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardBody>
          <Heading size="lg" mb={2} fontWeight="normal" color="black">
            Welcome, {studentData?.full_name || 'Student'}
          </Heading>
          <Text color="gray.600">
            Here's an overview of your placement journey
          </Text>
        </CardBody>
      </Card>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {/* Profile Completion */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="black">Profile Completion</StatLabel>
              <StatNumber color="black">{studentData?.profile_completion_percentage || 0}%</StatNumber>
              <Progress 
                value={studentData?.profile_completion_percentage || 0} 
                bg="gray.100"
                sx={{
                  '& > div': {
                    bg: 'black',
                  },
                }}
                mt={2} 
                borderRadius="full"
              />
              <StatHelpText>
                {studentData?.profile_completion_percentage >= 80 ? 'Excellent' : 'Keep going'}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        {/* Placement Status */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="black">Placement Status</StatLabel>
              <HStack mt={2}>
                <Badge 
                  variant="outline"
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="sm"
                  color="black"
                >
                  {studentData?.placement_status || 'Not Placed'}
                </Badge>
              </HStack>
              <StatHelpText>
                {studentData?.is_eligible_for_placement ? (
                  <HStack color="black">
                    <Icon as={FiCheckCircle} />
                    <Text>Eligible for drives</Text>
                  </HStack>
                ) : (
                  <HStack color="gray.600">
                    <Icon as={FiAlertCircle} />
                    <Text>Not eligible</Text>
                  </HStack>
                )}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        {/* CGPA */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="black">Current CGPA</StatLabel>
              <StatNumber color="black">{studentData?.cgpa || 'N/A'}</StatNumber>
              <StatHelpText>
                <HStack>
                  <Icon as={FiTrendingUp} />
                  <Text>Out of 10.0</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        {/* Applications */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="black">Active Applications</StatLabel>
              <StatNumber color="black">3</StatNumber>
              <StatHelpText>2 pending responses</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Profile Completion Alert */}
      {studentData?.profile_completion_percentage < 80 && (
        <Alert status="info" borderRadius="sm" bg="gray.50" borderWidth="1px" borderColor="gray.200">
          <AlertIcon color="black" />
          <Box>
            <AlertTitle>Complete Your Profile</AlertTitle>
            <AlertDescription>
              Your profile is {studentData?.profile_completion_percentage}% complete. 
              Complete it to {100 - studentData?.profile_completion_percentage}% to increase your visibility to recruiters.
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {/* Two Column Layout */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Upcoming Deadlines */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <HStack mb={4}>
              <Icon as={FiCalendar} boxSize={5} />
              <Heading size="md" fontWeight="normal" color="black">Upcoming Deadlines</Heading>
            </HStack>
            <Divider mb={4} />
            <VStack spacing={3} align="stretch">
              {upcomingDeadlines.map((item, index) => (
                <Box 
                  key={index} 
                  p={3} 
                  borderWidth="1px" 
                  borderRadius="md"
                  borderColor={borderColor}
                >
                  <HStack justify="space-between" mb={1}>
                    <Text fontWeight="bold" fontSize="sm" color="black">{item.company}</Text>
                    <Badge variant="outline" color="black">
                      {item.status}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.600" mb={1}>{item.role}</Text>
                  <HStack fontSize="xs" color="gray.500">
                    <Icon as={FiClock} />
                    <Text>Deadline: {new Date(item.deadline).toLocaleDateString()}</Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Notifications */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <HStack mb={4}>
              <Icon as={FiBriefcase} boxSize={5} />
              <Heading size="md" fontWeight="normal" color="black">Recent Notifications</Heading>
            </HStack>
            <Divider mb={4} />
            <VStack spacing={3} align="stretch">
              {notifications.map((notification) => (
                <Box 
                  key={notification.id} 
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={borderColor}
                  bg="gray.50"
                >
                  <Text fontSize="sm">{notification.message}</Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>{notification.time}</Text>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Quick Actions */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardBody>
          <Heading size="md" mb={4} fontWeight="normal" color="black">Quick Actions</Heading>
          <List spacing={2}>
            <ListItem>
              <HStack>
                <ListIcon as={FiCheckCircle} />
                <Text>Update your resume in My Profile</Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <ListIcon as={FiCheckCircle} />
                <Text>Browse available job drives</Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <ListIcon as={FiCheckCircle} />
                <Text>Check eligibility criteria for open positions</Text>
              </HStack>
            </ListItem>
            <ListItem>
              <HStack>
                <ListIcon as={FiCheckCircle} />
                <Text>Track your application status</Text>
              </HStack>
            </ListItem>
          </List>
        </CardBody>
      </Card>
    </VStack>
  );
}

export default DashboardTab;
