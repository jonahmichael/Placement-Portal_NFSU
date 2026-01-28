import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Button,
  VStack,
  HStack,
  Icon,
  Divider,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Box as ChakraBox,
  Alert,
  AlertIcon,
  Textarea,
  Link,
} from '@chakra-ui/react';
import { 
  FiBriefcase, 
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAlertCircle,
  FiFileText,
  FiMessageSquare,
} from 'react-icons/fi';

function MyApplicationsTab() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = 'white';
  const borderColor = 'gray.200';

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, filterStatus]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/student/applications');
      // const data = await response.json();
      
      // Mock applications data
      const mockApplications = [
        {
          application_id: '1',
          company_name: 'TechCorp Solutions',
          job_role_title: 'Software Engineer',
          ctc_package: 12.5,
          applied_on: '2026-01-15',
          current_status: 'Shortlisted',
          status_history: [
            { status: 'Applied', date: '2026-01-15', notes: 'Application submitted successfully' },
            { status: 'Under Review', date: '2026-01-18', notes: 'Your application is being reviewed' },
            { status: 'Shortlisted', date: '2026-01-20', notes: 'Congratulations! You have been shortlisted for the next round' },
          ],
          interview_schedule: {
            round: 'Technical Interview',
            date: '2026-01-25',
            time: '10:00 AM',
            mode: 'Online',
            meeting_link: 'https://meet.google.com/abc-defg-hij',
          },
          feedback: null,
        },
        {
          application_id: '2',
          company_name: 'DataFlow Inc',
          job_role_title: 'Data Analyst',
          ctc_package: 10.0,
          applied_on: '2026-01-10',
          current_status: 'Rejected',
          status_history: [
            { status: 'Applied', date: '2026-01-10', notes: 'Application submitted successfully' },
            { status: 'Under Review', date: '2026-01-12', notes: '' },
            { status: 'Rejected', date: '2026-01-14', notes: 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.' },
          ],
          interview_schedule: null,
          feedback: 'Consider improving your data analysis skills and SQL proficiency.',
        },
        {
          application_id: '3',
          company_name: 'FinTech Solutions',
          job_role_title: 'Software Developer',
          ctc_package: 11.0,
          applied_on: '2026-01-20',
          current_status: 'Under Review',
          status_history: [
            { status: 'Applied', date: '2026-01-20', notes: 'Application submitted successfully' },
            { status: 'Under Review', date: '2026-01-21', notes: 'Your application is being reviewed by the recruitment team' },
          ],
          interview_schedule: null,
          feedback: null,
        },
        {
          application_id: '4',
          company_name: 'WebCraft Studios',
          job_role_title: 'Frontend Developer',
          ctc_package: 9.5,
          applied_on: '2026-01-05',
          current_status: 'Selected',
          status_history: [
            { status: 'Applied', date: '2026-01-05', notes: 'Application submitted successfully' },
            { status: 'Shortlisted', date: '2026-01-08', notes: 'Shortlisted for interview' },
            { status: 'Interview Scheduled', date: '2026-01-10', notes: 'Technical interview scheduled' },
            { status: 'Interview Completed', date: '2026-01-12', notes: 'Interview completed successfully' },
            { status: 'Selected', date: '2026-01-15', notes: 'Congratulations! You have been selected for the position.' },
          ],
          interview_schedule: null,
          feedback: 'Excellent problem-solving skills and good understanding of React.',
          offer_letter_url: '/documents/offer-letter-webcraft.pdf',
        },
      ];
      
      setApplications(mockApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (filterStatus === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => 
        app.current_status.toLowerCase().replace(' ', '_') === filterStatus
      ));
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    onOpen();
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Applied': 'blue',
      'Under Review': 'yellow',
      'Shortlisted': 'cyan',
      'Interview Scheduled': 'purple',
      'Interview Completed': 'orange',
      'Selected': 'green',
      'Rejected': 'red',
      'Withdrawn': 'gray',
    };
    return statusColors[status] || 'gray';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'Applied': FiFileText,
      'Under Review': FiClock,
      'Shortlisted': FiCheckCircle,
      'Interview Scheduled': FiCalendar,
      'Interview Completed': FiCheckCircle,
      'Selected': FiCheckCircle,
      'Rejected': FiXCircle,
      'Withdrawn': FiAlertCircle,
    };
    return statusIcons[status] || FiFileText;
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header & Filters */}
      <Card bg={cardBg} borderWidth="1px" borderColor="gray.200">
        <CardBody>
          <HStack justify="space-between" flexWrap="wrap" spacing={4}>
            <Heading size="md" color="black">My Applications</Heading>
            
            <HStack>
              <Select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                maxW="200px"
              >
                <option value="all">All Applications</option>
                <option value="applied">Applied</option>
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </Select>

              <Button variant="outline" onClick={fetchApplications}>
                Refresh
              </Button>
            </HStack>
          </HStack>

          <Text fontSize="sm" color="gray.600" mt={2}>
            Total Applications: {applications.length} | Showing: {filteredApplications.length}
          </Text>
        </CardBody>
      </Card>

      {/* Applications List */}
      {loading ? (
        <Text>Loading applications...</Text>
      ) : filteredApplications.length === 0 ? (
        <Card bg={cardBg}>
          <CardBody>
            <Text textAlign="center" color="gray.500">No applications found</Text>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {filteredApplications.map((application) => (
            <Card 
              key={application.application_id} 
              bg={cardBg} 
              shadow="md"
              borderLeftWidth="4px"
              borderLeftWidth="3px"
              borderLeftColor="gray.400"
              _hover={{ borderColor: 'black' }}
            >
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  {/* Status Badge */}
                  <HStack justify="space-between">
                    <Badge 
                      variant="outline"
                      fontSize="sm"
                      px={2}
                      py={1}
                      color="black"
                    >
                      <HStack spacing={1}>
                        <Icon as={getStatusIcon(application.current_status)} />
                        <Text>{application.current_status}</Text>
                      </HStack>
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      Applied: {new Date(application.applied_on).toLocaleDateString()}
                    </Text>
                  </HStack>

                  {/* Company & Role */}
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" noOfLines={1} color="black">
                      {application.company_name}
                    </Text>
                    <Text color="gray.600" fontSize="md" noOfLines={1}>
                      {application.job_role_title}
                    </Text>
                    <Text fontWeight="semibold" fontSize="sm">
                      ₹{application.ctc_package} LPA
                    </Text>
                  </Box>

                  <Divider />

                  {/* Interview Schedule (if exists) */}
                  {application.interview_schedule && (
                    <Box p={3} bg="gray.50" borderRadius="md" fontSize="sm" borderWidth="1px" borderColor="gray.200">
                      <Text fontWeight="bold">{application.interview_schedule.round}</Text>
                      <Text fontSize="xs">
                        {new Date(application.interview_schedule.date).toLocaleDateString()} at {application.interview_schedule.time}
                      </Text>
                      <Text fontSize="xs">Mode: {application.interview_schedule.mode}</Text>
                    </Box>
                  )}

                  {/* Offer Letter (if selected) */}
                  {application.current_status === 'Selected' && application.offer_letter_url && (
                    <Box p={3} bg="gray.50" borderRadius="md" fontSize="sm" borderWidth="1px" borderColor="gray.200">
                      <Text fontWeight="bold">Offer Letter Available</Text>
                      <Link href={application.offer_letter_url} textDecoration="underline" isExternal>
                        Download Offer Letter
                      </Link>
                    </Box>
                  )}

                  {/* View Details Button */}
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(application)}
                  >
                    View Timeline & Details
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Application Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={1}>
              <Text>{selectedApplication?.company_name}</Text>
              <Text fontSize="md" fontWeight="normal" color="gray.600">
                {selectedApplication?.job_role_title}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedApplication && (
              <VStack align="stretch" spacing={6}>
                {/* Current Status */}
                <Box>
                  <Heading size="sm" mb={2}>Current Status</Heading>
                  <Badge 
                    variant="outline"
                    fontSize="md"
                    px={3}
                    py={2}
                  >
                    {selectedApplication.current_status}
                  </Badge>
                </Box>

                {/* Application Timeline */}
                <Box>
                  <Heading size="sm" mb={4}>Application Timeline</Heading>
                  <Stepper 
                    index={selectedApplication.status_history.length - 1} 
                    orientation="vertical"
                    gap="0"
                  >
                    {selectedApplication.status_history.map((step, index) => (
                      <Step key={index}>
                        <StepIndicator>
                          <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                          />
                        </StepIndicator>

                        <Box flexShrink="0" ml={4} mb={4}>
                          <StepTitle>
                            <Text fontWeight="bold">{step.status}</Text>
                          </StepTitle>
                          <StepDescription>
                            <Text fontSize="sm" color="gray.600">
                              {new Date(step.date).toLocaleDateString()}
                            </Text>
                            {step.notes && (
                              <Text fontSize="sm" mt={1}>
                                {step.notes}
                              </Text>
                            )}
                          </StepDescription>
                        </Box>

                        <StepSeparator />
                      </Step>
                    ))}
                  </Stepper>
                </Box>

                {/* Interview Schedule */}
                {selectedApplication.interview_schedule && (
                  <Box>
                    <Heading size="sm" mb={2}>Interview Schedule</Heading>
                    <Card bg="gray.50" borderWidth="1px" borderColor="gray.200">
                      <CardBody>
                        <VStack align="stretch" spacing={2} fontSize="sm">
                          <HStack>
                            <Text fontWeight="bold">Round:</Text>
                            <Text>{selectedApplication.interview_schedule.round}</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FiCalendar} />
                            <Text fontWeight="bold">Date & Time:</Text>
                            <Text>
                              {new Date(selectedApplication.interview_schedule.date).toLocaleDateString()} 
                              {' at '} 
                              {selectedApplication.interview_schedule.time}
                            </Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold">Mode:</Text>
                            <Text>{selectedApplication.interview_schedule.mode}</Text>
                          </HStack>
                          {selectedApplication.interview_schedule.meeting_link && (
                            <Box>
                              <Text fontWeight="bold" mb={1}>Meeting Link:</Text>
                              <Link 
                                href={selectedApplication.interview_schedule.meeting_link} 
                                textDecoration="underline"
                                isExternal
                              >
                                {selectedApplication.interview_schedule.meeting_link}
                              </Link>
                            </Box>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  </Box>
                )}

                {/* Feedback */}
                {selectedApplication.feedback && (
                  <Box>
                    <Heading size="sm" mb={2}>
                      <HStack>
                        <Icon as={FiMessageSquare} />
                        <Text>Feedback</Text>
                      </HStack>
                    </Heading>
                    <Box p={3} bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200">
                      <Text fontSize="sm">{selectedApplication.feedback}</Text>
                    </Box>
                  </Box>
                )}

                {/* Offer Letter */}
                {selectedApplication.offer_letter_url && (
                  <Box>
                    <Heading size="sm" mb={2}>Offer Letter</Heading>
                    <Button 
                      as="a" 
                      href={selectedApplication.offer_letter_url}
                      variant="solid"
                      bg="black"
                      color="white"
                      _hover={{ bg: 'gray.700' }}
                      leftIcon={<Icon as={FiFileText} />}
                      download
                    >
                      Download Offer Letter
                    </Button>
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

export default MyApplicationsTab;
