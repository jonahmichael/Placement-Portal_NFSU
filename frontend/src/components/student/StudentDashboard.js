import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  useColorModeValue,
  Flex,
  Button,
  Avatar,
  Text,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { FiHome, FiUser, FiBriefcase, FiFileText, FiAward, FiLogOut } from 'react-icons/fi';

// Import tab components
import DashboardTab from './tabs/DashboardTab';
import MyProfileTab from './tabs/MyProfileTab';
import JobDrivesTab from './tabs/JobDrivesTab';
import MyApplicationsTab from './tabs/MyApplicationsTab';
import MyPlacementsTab from './tabs/MyPlacementsTab';

function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState(0);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Fetch student data on mount
  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/student/profile/master');
      // const data = await response.json();
      
      // Mock data for now
      const mockData = {
        student_id: 'uuid-123',
        full_name: 'Raj Kumar Sharma',
        roll_number: 'NFSU2024001',
        email_college: 'raj.sharma@nfsu.ac.in',
        profile_completion_percentage: 75,
        placement_status: 'Not Placed',
        eligible_for_placement_drives: true,
        cgpa: 8.5,
        branch: 'Computer Science & Engineering',
        course: 'B.Tech',
        year_of_passing: 2025,
      };
      
      setStudentData(mockData);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box bg={headerBg} borderBottom="1px" borderColor={borderColor} position="sticky" top={0} zIndex={10} shadow="sm">
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Avatar 
                size="md" 
                name={studentData?.full_name || 'Student'} 
                bg="blue.500"
              />
              <Box>
                <Heading size="sm">{studentData?.full_name || 'Loading...'}</Heading>
                <Text fontSize="xs" color="gray.600">
                  {studentData?.roll_number} • {studentData?.branch}
                </Text>
              </Box>
            </HStack>
            
            <HStack spacing={4}>
              <Badge colorScheme={studentData?.placement_status === 'Placed' ? 'green' : 'orange'}>
                {studentData?.placement_status || 'Loading...'}
              </Badge>
              <Button 
                leftIcon={<FiLogOut />} 
                variant="ghost" 
                colorScheme="red"
                onClick={onLogout}
                size="sm"
              >
                Logout
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content with Tabs */}
      <Container maxW="container.xl" py={8}>
        <Tabs 
          index={activeTab} 
          onChange={setActiveTab} 
          variant="enclosed" 
          colorScheme="blue"
          isLazy
        >
          <TabList mb={4} flexWrap="wrap">
            <Tab>
              <HStack spacing={2}>
                <FiHome />
                <Text>Dashboard</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <FiUser />
                <Text>My Profile</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <FiBriefcase />
                <Text>Job Drives</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <FiFileText />
                <Text>My Applications</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <FiAward />
                <Text>My Placements</Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <DashboardTab studentData={studentData} loading={loading} />
            </TabPanel>
            
            <TabPanel px={0}>
              <MyProfileTab studentData={studentData} onUpdate={fetchStudentData} />
            </TabPanel>
            
            <TabPanel px={0}>
              <JobDrivesTab studentData={studentData} />
            </TabPanel>
            
            <TabPanel px={0}>
              <MyApplicationsTab studentData={studentData} />
            </TabPanel>
            
            <TabPanel px={0}>
              <MyPlacementsTab studentData={studentData} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}

export default StudentDashboard;
