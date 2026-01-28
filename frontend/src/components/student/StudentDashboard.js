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

  const bgColor = 'white';
  const headerBg = 'white';
  const borderColor = 'gray.200';

  // Fetch student data on mount
  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('No access token found');
        onLogout();
        return;
      }

      // Fetch master profile (read-only data)
      const masterResponse = await fetch('http://localhost:5000/api/student/profile/master', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!masterResponse.ok) {
        if (masterResponse.status === 401) {
          console.error('Unauthorized - token expired');
          onLogout();
          return;
        }
        throw new Error('Failed to fetch master profile');
      }

      const masterData = await masterResponse.json();

      // Fetch editable profile
      const editableResponse = await fetch('http://localhost:5000/api/student/profile/editable', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let editableData = {};
      if (editableResponse.ok) {
        editableData = await editableResponse.json();
      }

      // Calculate profile completion percentage
      const totalFields = 20;
      let completedFields = 0;
      
      // Check master fields
      if (masterData.full_name) completedFields++;
      if (masterData.email) completedFields++;
      if (masterData.contact_number) completedFields++;
      if (masterData.date_of_birth) completedFields++;
      if (masterData.cgpa) completedFields++;
      if (masterData.tenth_percentage) completedFields++;
      if (masterData.twelfth_percentage) completedFields++;
      if (masterData.personal_email) completedFields++;
      if (masterData.permanent_address) completedFields++;
      if (masterData.current_address) completedFields++;
      
      // Check editable fields
      if (editableData.primary_skills?.length > 0) completedFields++;
      if (editableData.programming_languages?.length > 0) completedFields++;
      if (editableData.projects?.length > 0) completedFields++;
      if (editableData.internships?.length > 0) completedFields++;
      if (editableData.achievements?.length > 0) completedFields++;
      if (editableData.certifications?.length > 0) completedFields++;
      if (editableData.linkedin_profile) completedFields++;
      if (editableData.github_profile) completedFields++;
      if (editableData.resume_url) completedFields++;
      if (editableData.photo_url) completedFields++;
      
      const profileCompletionPercentage = Math.round((completedFields / totalFields) * 100);

      // Combine both profiles
      const combinedData = {
        ...masterData,
        profile_completion_percentage: profileCompletionPercentage,
        editable: editableData,
      };
      
      setStudentData(combinedData);
    } catch (error) {
      console.error('Error fetching student data:', error);
      // Keep showing any existing data, don't clear it
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
                bg="black"
              />
              <Box>
                <Heading size="sm" fontWeight="normal" color="black">{studentData?.full_name || 'Loading...'}</Heading>
                <Text fontSize="xs" color="gray.600">
                  {studentData?.roll_number} • {studentData?.branch}
                </Text>
              </Box>
            </HStack>
            
            <HStack spacing={4}>
              <Badge variant="outline" borderColor="gray.400" color="black">
                {studentData?.placement_status || 'Loading...'}
              </Badge>
              <Button 
                leftIcon={<FiLogOut />} 
                variant="ghost"
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
          variant="line"
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
