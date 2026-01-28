import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
  Button,
  Divider,
  SimpleGrid,
  Alert,
  AlertIcon,
  useColorModeValue,
  Link,
  Image,
  Stack,
} from '@chakra-ui/react';
import { 
  FiBriefcase, 
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiCheckCircle,
  FiFileText,
  FiAward,
  FiClock,
} from 'react-icons/fi';

function MyPlacementsTab() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardBg = 'white';
  const successBg = 'gray.50';
  const borderColor = 'gray.200';

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/student/placements');
      // const data = await response.json();
      
      // Mock placements data
      const mockPlacements = [
        {
          placement_id: '1',
          company_name: 'WebCraft Studios',
          company_logo: 'https://via.placeholder.com/80',
          job_role_title: 'Frontend Developer',
          job_type: 'Full-time',
          ctc_package: 9.5,
          work_location: 'Bangalore, Karnataka',
          placed_on: '2026-01-15',
          joining_date: '2026-07-01',
          offer_letter_url: '/documents/offer-letter-webcraft.pdf',
          acceptance_status: 'Accepted',
          acceptance_date: '2026-01-18',
          employment_type: 'Permanent',
          probation_period: '6 months',
          bond_duration: null,
          relocation_assistance: true,
        },
      ];
      
      setPlacements(mockPlacements);
    } catch (error) {
      console.error('Error fetching placements:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Card bg={cardBg} shadow="md">
        <CardBody>
          <HStack justify="space-between" flexWrap="wrap">
            <VStack align="start" spacing={1}>
              <Heading size="md" color="black">My Placements</Heading>
              <Text fontSize="sm" color="gray.600">
                Your placement records and offer details
              </Text>
            </VStack>
            
            <Button variant="outline" onClick={fetchPlacements}>
              Refresh
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Placements Display */}
      {loading ? (
        <Text>Loading placements...</Text>
      ) : placements.length === 0 ? (
        <Card bg={cardBg}>
          <CardBody>
            <VStack spacing={4} py={8}>
              <Icon as={FiBriefcase} boxSize={12} color="gray.400" />
              <Heading size="md" color="gray.700">No Placements Yet</Heading>
              <Text color="gray.500" textAlign="center">
                Your placement records will appear here once you are selected by a company
              </Text>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <VStack spacing={6} align="stretch">
          {/* Congratulations Banner (if placed) */}
          <Box 
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            textAlign="center"
          >
            <Icon as={FiAward} boxSize={12} mb={2} />
            <Heading size="md" mb={2} fontWeight="normal" color="black">Congratulations!</Heading>
            <Text fontSize="lg" color="black">
              You have been successfully placed with {placements[0].company_name}
            </Text>
          </Box>

          {/* Placement Cards */}
          {placements.map((placement) => (
            <Card 
              key={placement.placement_id} 
              bg={successBg} 
              borderWidth="1px"
              borderColor="gray.200"
            >
              <CardBody>
                <VStack align="stretch" spacing={6}>
                  {/* Company Header */}
                  <HStack spacing={4} flexWrap="wrap">
                    {placement.company_logo && (
                      <Image 
                        src={placement.company_logo} 
                        alt={placement.company_name}
                        boxSize="80px"
                        objectFit="contain"
                        borderRadius="md"
                        bg="white"
                        p={2}
                      />
                    )}
                    <VStack align="start" flex={1} spacing={1}>
                      <Heading size="lg" color="black">{placement.company_name}</Heading>
                      <Text fontSize="xl" fontWeight="semibold" color="gray.700">
                        {placement.job_role_title}
                      </Text>
                      <Badge variant="outline" fontSize="md" px={2} py={1} color="black">
                        <HStack spacing={1}>
                          <Icon as={FiCheckCircle} />
                          <Text>{placement.acceptance_status}</Text>
                        </HStack>
                      </Badge>
                    </VStack>
                  </HStack>

                  <Divider />

                  {/* Placement Details Grid */}
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    <Box>
                      <HStack mb={2}>
                        <Icon as={FiDollarSign} boxSize={5} />
                        <Text fontWeight="bold" fontSize="sm" color="gray.600">
                          Package
                        </Text>
                      </HStack>
                      <Text fontSize="2xl" fontWeight="bold">
                        ₹{placement.ctc_package} LPA
                      </Text>
                    </Box>

                    <Box>
                      <HStack mb={2}>
                        <Icon as={FiMapPin} boxSize={5} />
                        <Text fontWeight="bold" fontSize="sm" color="gray.600">
                          Location
                        </Text>
                      </HStack>
                      <Text fontSize="md" fontWeight="semibold">
                        {placement.work_location}
                      </Text>
                    </Box>

                    <Box>
                      <HStack mb={2}>
                        <Icon as={FiBriefcase} boxSize={5} />
                        <Text fontWeight="bold" fontSize="sm" color="gray.600">
                          Job Type
                        </Text>
                      </HStack>
                      <Text fontSize="md" fontWeight="semibold">
                        {placement.job_type}
                      </Text>
                    </Box>

                    <Box>
                      <HStack mb={2}>
                        <Icon as={FiCalendar} boxSize={5} />
                        <Text fontWeight="bold" fontSize="sm" color="gray.600">
                          Placed On
                        </Text>
                      </HStack>
                      <Text fontSize="md" fontWeight="semibold">
                        {new Date(placement.placed_on).toLocaleDateString()}
                      </Text>
                    </Box>

                    <Box>
                      <HStack mb={2}>
                        <Icon as={FiCalendar} boxSize={5} />
                        <Text fontWeight="bold" fontSize="sm" color="gray.600">
                          Joining Date
                        </Text>
                      </HStack>
                      <Text fontSize="md" fontWeight="semibold">
                        {new Date(placement.joining_date).toLocaleDateString()}
                      </Text>
                    </Box>

                    <Box>
                      <HStack mb={2}>
                        <Icon as={FiClock} boxSize={5} />
                        <Text fontWeight="bold" fontSize="sm" color="gray.600">
                          Employment Type
                        </Text>
                      </HStack>
                      <Text fontSize="md" fontWeight="semibold">
                        {placement.employment_type}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  <Divider />

                  {/* Additional Details */}
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold" fontSize="sm" color="gray.600">
                        Probation Period
                      </Text>
                      <Text fontSize="md">
                        {placement.probation_period || 'N/A'}
                      </Text>
                    </VStack>

                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold" fontSize="sm" color="gray.600">
                        Bond Duration
                      </Text>
                      <Text fontSize="md">
                        {placement.bond_duration || 'No Bond'}
                      </Text>
                    </VStack>

                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold" fontSize="sm" color="gray.600">
                        Relocation Assistance
                      </Text>
                      <Badge variant="outline" color="black">
                        {placement.relocation_assistance ? 'Available' : 'Not Available'}
                      </Badge>
                    </VStack>

                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold" fontSize="sm" color="gray.600">
                        Acceptance Date
                      </Text>
                      <Text fontSize="md">
                        {placement.acceptance_date 
                          ? new Date(placement.acceptance_date).toLocaleDateString()
                          : 'Pending'
                        }
                      </Text>
                    </VStack>
                  </SimpleGrid>

                  {/* Offer Letter Section */}
                  {placement.offer_letter_url && (
                    <>
                      <Divider />
                      <Box>
                        <Heading size="sm" mb={3}>Offer Letter</Heading>
                        <HStack spacing={3}>
                          <Button 
                            as="a" 
                            href={placement.offer_letter_url}
                            variant="solid"
                            bg="black"
                            color="white"
                            _hover={{ bg: 'gray.700' }}
                            leftIcon={<Icon as={FiFileText} />}
                            download
                          >
                            Download Offer Letter
                          </Button>
                          <Button 
                            as="a" 
                            href={placement.offer_letter_url}
                            variant="outline"
                            leftIcon={<Icon as={FiFileText} />}
                            target="_blank"
                          >
                            View Online
                          </Button>
                        </HStack>
                      </Box>
                    </>
                  )}

                  {/* Important Information */}
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box fontSize="sm">
                      <Text fontWeight="bold">Important Information</Text>
                      <Text>
                        Please keep in touch with the placement office and the company HR for any 
                        further updates regarding your joining formalities and document requirements.
                      </Text>
                    </Box>
                  </Alert>
                </VStack>
              </CardBody>
            </Card>
          ))}

          {/* Next Steps Card */}
          <Card bg={cardBg} borderWidth="1px" borderColor="gray.200">
            <CardBody>
              <VStack align="start" spacing={3}>
                <Heading size="md" fontWeight="normal" color="black">Next Steps</Heading>
                <Stack spacing={2} pl={4}>
                  <HStack>
                    <Icon as={FiCheckCircle} />
                    <Text fontSize="sm">Download and save your offer letter</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} />
                    <Text fontSize="sm">Keep all required documents ready</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} />
                    <Text fontSize="sm">Stay in touch with HR for joining formalities</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} />
                    <Text fontSize="sm">Complete any pre-joining requirements</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheckCircle} />
                    <Text fontSize="sm">Inform placement office of any concerns</Text>
                  </HStack>
                </Stack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      )}
    </VStack>
  );
}

export default MyPlacementsTab;
