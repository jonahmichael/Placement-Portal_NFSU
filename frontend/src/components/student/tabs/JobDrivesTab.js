import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Badge,
  Button,
  VStack,
  HStack,
  Icon,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Flex,
  Tag,
  TagLabel,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiBriefcase, 
  FiMapPin, 
  FiDollarSign, 
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from 'react-icons/fi';

function JobDrivesTab({ studentData }) {
  const [drives, setDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const cardBg = 'white';
  const borderColor = 'gray.200';

  useEffect(() => {
    fetchJobDrives();
  }, []);

  useEffect(() => {
    filterDrives();
  }, [drives, searchTerm, filterStatus]);

  const fetchJobDrives = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/student/eligible-drives');
      // const data = await response.json();
      
      // Mock data with eligibility checking
      const mockDrives = [
        {
          drive_id: '1',
          company_name: 'TechCorp Solutions',
          job_role_title: 'Software Engineer',
          ctc_package: 12.5,
          job_type: 'Full-time',
          work_location: 'Gandhinagar, Gujarat',
          application_end_date: '2026-02-15',
          number_of_vacancies: 5,
          minimum_cgpa: 7.0,
          backlogs_allowed: 0,
          is_eligible: true,
          already_applied: false,
          ineligibility_reasons: [],
          eligible_courses: ['B.Tech', 'M.Tech'],
          eligible_branches: ['CSE', 'IT'],
        },
        {
          drive_id: '2',
          company_name: 'DataFlow Inc',
          job_role_title: 'Data Analyst',
          ctc_package: 10.0,
          job_type: 'Full-time',
          work_location: 'Ahmedabad, Gujarat',
          application_end_date: '2026-02-20',
          number_of_vacancies: 3,
          minimum_cgpa: 8.0,
          backlogs_allowed: 1,
          is_eligible: true,
          already_applied: false,
          ineligibility_reasons: [],
          eligible_courses: ['B.Tech'],
          eligible_branches: ['CSE', 'IT', 'ECE'],
        },
        {
          drive_id: '3',
          company_name: 'CloudNet Systems',
          job_role_title: 'Backend Developer',
          ctc_package: 15.0,
          job_type: 'Full-time',
          work_location: 'Bangalore, Karnataka',
          application_end_date: '2026-02-10',
          number_of_vacancies: 2,
          minimum_cgpa: 9.0,
          backlogs_allowed: 0,
          is_eligible: false,
          already_applied: false,
          ineligibility_reasons: [
            'CGPA too low (Required: 9.0, Yours: 8.5)',
          ],
          eligible_courses: ['B.Tech'],
          eligible_branches: ['CSE'],
        },
        {
          drive_id: '4',
          company_name: 'FinTech Solutions',
          job_role_title: 'Software Developer',
          ctc_package: 11.0,
          job_type: 'Full-time',
          work_location: 'Mumbai, Maharashtra',
          application_end_date: '2026-01-25',
          number_of_vacancies: 4,
          minimum_cgpa: 7.5,
          backlogs_allowed: 0,
          is_eligible: true,
          already_applied: true,
          application_status: 'Applied',
          ineligibility_reasons: [],
          eligible_courses: ['B.Tech'],
          eligible_branches: ['CSE', 'IT'],
        },
      ];
      
      setDrives(mockDrives);
    } catch (error) {
      console.error('Error fetching drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDrives = () => {
    let filtered = drives;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(drive =>
        drive.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drive.job_role_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === 'eligible') {
      filtered = filtered.filter(drive => drive.is_eligible && !drive.already_applied);
    } else if (filterStatus === 'applied') {
      filtered = filtered.filter(drive => drive.already_applied);
    } else if (filterStatus === 'ineligible') {
      filtered = filtered.filter(drive => !drive.is_eligible);
    }

    setFilteredDrives(filtered);
  };

  const handleViewDetails = (drive) => {
    setSelectedDrive(drive);
    onOpen();
  };

  const handleApply = async (driveId) => {
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/student/apply', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ drive_id: driveId })
      // });
      
      toast({
        title: 'Application submitted',
        description: 'Your application has been submitted successfully',
        status: 'success',
        duration: 3000,
      });
      
      onClose();
      fetchJobDrives(); // Refresh drives
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header & Filters */}
      <Card bg={cardBg} shadow="md">
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="black">Available Job Drives</Heading>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input 
                  placeholder="Search company or role..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <Select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Drives</option>
                <option value="eligible">Eligible</option>
                <option value="applied">Already Applied</option>
                <option value="ineligible">Not Eligible</option>
              </Select>

              <Button variant="outline" onClick={fetchJobDrives}>
                Refresh
              </Button>
            </SimpleGrid>

            <Text fontSize="sm" color="gray.600">
              Showing {filteredDrives.length} of {drives.length} drives
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* Drives Grid */}
      {loading ? (
        <Text>Loading job drives...</Text>
      ) : filteredDrives.length === 0 ? (
        <Card bg={cardBg}>
          <CardBody>
            <Text textAlign="center" color="gray.500">No drives found</Text>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredDrives.map((drive) => (
            <Card 
              key={drive.drive_id} 
              bg={cardBg} 
              borderWidth="1px"
              borderColor="gray.200"
              _hover={{ borderColor: 'gray.400' }}
            >
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  {/* Status Badge */}
                  <HStack justify="space-between">
                    <Badge 
                      variant="outline"
                      fontSize="xs"
                      color="black"
                    >
                      {drive.already_applied ? drive.application_status : 
                       drive.is_eligible ? 'Eligible' : 
                       'Not Eligible'}
                    </Badge>
                  </HStack>

                  {/* Company & Role */}
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" noOfLines={1} color="black">
                      {drive.company_name}
                    </Text>
                    <Text color="gray.600" fontSize="md" noOfLines={1}>
                      {drive.job_role_title}
                    </Text>
                  </Box>

                  <Divider />

                  {/* Details */}
                  <VStack align="stretch" spacing={2} fontSize="sm">
                    <HStack>
                      <Icon as={FiDollarSign} />
                      <Text>{drive.ctc_package} LPA</Text>
                    </HStack>

                    <HStack>
                      <Icon as={FiMapPin} />
                      <Text noOfLines={1}>{drive.work_location}</Text>
                    </HStack>

                    <HStack>
                      <Icon as={FiCalendar} />
                      <Text>Deadline: {new Date(drive.application_end_date).toLocaleDateString()}</Text>
                    </HStack>

                    <HStack>
                      <Icon as={FiBriefcase} />
                      <Text>{drive.number_of_vacancies} positions</Text>
                    </HStack>
                  </VStack>

                  {/* Ineligibility Reasons */}
                  {!drive.is_eligible && drive.ineligibility_reasons.length > 0 && (
                    <Box p={2} bg="gray.50" borderRadius="md" fontSize="xs" borderWidth="1px" borderColor="gray.200">
                      <Text>{drive.ineligibility_reasons[0]}</Text>
                    </Box>
                  )}

                  <Divider />

                  {/* Actions */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(drive)}
                  >
                    View Details
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Drive Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={1}>
              <Text>{selectedDrive?.company_name}</Text>
              <Text fontSize="md" fontWeight="normal" color="gray.600">
                {selectedDrive?.job_role_title}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedDrive && (
              <VStack align="stretch" spacing={4}>
                {/* Eligibility Status */}
                <Box 
                  p={4}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                  bg="gray.50"
                >
                  <Text fontWeight="bold">
                    {selectedDrive.is_eligible ? 'You are eligible for this drive!' : 'You are not eligible'}
                  </Text>
                  {!selectedDrive.is_eligible && selectedDrive.ineligibility_reasons.length > 0 && (
                    <List mt={2} spacing={1} fontSize="sm">
                      {selectedDrive.ineligibility_reasons.map((reason, idx) => (
                        <ListItem key={idx}>
                          <ListIcon as={FiXCircle} />
                          {reason}
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>

                {/* Job Details */}
                <Box>
                  <Heading size="sm" mb={2}>Job Details</Heading>
                  <SimpleGrid columns={2} spacing={3} fontSize="sm">
                    <Box>
                      <Text color="gray.600">Package</Text>
                      <Text fontWeight="bold">{selectedDrive.ctc_package} LPA</Text>
                    </Box>
                    <Box>
                      <Text color="gray.600">Job Type</Text>
                      <Text fontWeight="bold">{selectedDrive.job_type}</Text>
                    </Box>
                    <Box>
                      <Text color="gray.600">Location</Text>
                      <Text fontWeight="bold">{selectedDrive.work_location}</Text>
                    </Box>
                    <Box>
                      <Text color="gray.600">Vacancies</Text>
                      <Text fontWeight="bold">{selectedDrive.number_of_vacancies}</Text>
                    </Box>
                    <Box>
                      <Text color="gray.600">Application Deadline</Text>
                      <Text fontWeight="bold">
                        {new Date(selectedDrive.application_end_date).toLocaleDateString()}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Eligibility Criteria */}
                <Box>
                  <Heading size="sm" mb={2}>Eligibility Criteria</Heading>
                  <VStack align="stretch" spacing={2} fontSize="sm">
                    <HStack>
                      <Text color="gray.600">Minimum CGPA:</Text>
                      <Badge>{selectedDrive.minimum_cgpa}</Badge>
                    </HStack>
                    <HStack>
                      <Text color="gray.600">Backlogs Allowed:</Text>
                      <Badge>{selectedDrive.backlogs_allowed}</Badge>
                    </HStack>
                    <Box>
                      <Text color="gray.600" mb={1}>Eligible Courses:</Text>
                      <HStack flexWrap="wrap">
                        {selectedDrive.eligible_courses.map((course, idx) => (
                          <Tag key={idx} size="sm" variant="outline">
                            <TagLabel>{course}</TagLabel>
                          </Tag>
                        ))}
                      </HStack>
                    </Box>
                    <Box>
                      <Text color="gray.600" mb={1}>Eligible Branches:</Text>
                      <HStack flexWrap="wrap">
                        {selectedDrive.eligible_branches.map((branch, idx) => (
                          <Tag key={idx} size="sm" variant="outline">
                            <TagLabel>{branch}</TagLabel>
                          </Tag>
                        ))}
                      </HStack>
                    </Box>
                  </VStack>
                </Box>

                {/* Apply Button */}
                {selectedDrive.is_eligible && !selectedDrive.already_applied && (
                  <Button 
                    variant="solid" 
                    size="lg"
                    bg="black"
                    color="white"
                    _hover={{ bg: 'gray.700' }}
                    onClick={() => handleApply(selectedDrive.drive_id)}
                  >
                    Apply Now
                  </Button>
                )}

                {selectedDrive.already_applied && (
                  <Box p={3} bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200">
                    <Text>You have already applied to this drive</Text>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default JobDrivesTab;
