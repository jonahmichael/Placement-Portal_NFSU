import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  VStack,
  Text,
  useToast,
  IconButton,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

function CertificationsSection({ profileData, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const handleEdit = () => {
    setFormData({
      certifications: profileData?.editable?.certifications || [],
      workshops_trainings: profileData?.editable?.workshops_trainings || [],
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate('certifications', formData);
      setIsEditing(false);
      toast({
        title: 'Certifications updated',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error updating certifications',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...(formData.certifications || []),
        { certificate_name: '', issuing_organization: '', issue_date: '', certificate_url: '' }
      ]
    });
  };

  const updateCertification = (index, field, value) => {
    const updated = [...formData.certifications];
    updated[index][field] = value;
    setFormData({...formData, certifications: updated});
  };

  const removeCertification = (index) => {
    const updated = formData.certifications.filter((_, i) => i !== index);
    setFormData({...formData, certifications: updated});
  };

  const addWorkshop = () => {
    setFormData({
      ...formData,
      workshops_trainings: [
        ...(formData.workshops_trainings || []),
        { workshop_name: '', organizer: '', date_attended: '' }
      ]
    });
  };

  const updateWorkshop = (index, field, value) => {
    const updated = [...formData.workshops_trainings];
    updated[index][field] = value;
    setFormData({...formData, workshops_trainings: updated});
  };

  const removeWorkshop = (index) => {
    const updated = formData.workshops_trainings.filter((_, i) => i !== index);
    setFormData({...formData, workshops_trainings: updated});
  };

  return (
    <VStack align="stretch" spacing={6}>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold" color="black">Certifications & Trainings</Text>
        {!isEditing ? (
          <Button leftIcon={<FiEdit />} variant="outline" size="sm" onClick={handleEdit}>
            Edit
          </Button>
        ) : (
          <HStack>
            <Button leftIcon={<FiSave />} variant="solid" bg="black" color="white" _hover={{ bg: 'gray.700' }} size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button leftIcon={<FiX />} variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </HStack>
        )}
      </HStack>

      {/* Certifications */}
      <Box>
        <HStack justify="space-between" mb={3}>
          <Text fontWeight="semibold">Certifications</Text>
          {isEditing && (
            <Button 
              leftIcon={<FiPlus />} 
              size="xs" 
              variant="outline"
              onClick={addCertification}
            >
              Add Certification
            </Button>
          )}
        </HStack>

        {!isEditing ? (
          <VStack align="stretch" spacing={3}>
            {(profileData?.editable?.certifications || []).length === 0 ? (
              <Text color="gray.500" fontSize="sm">No certifications added</Text>
            ) : (
              (profileData?.editable?.certifications || []).map((cert, index) => (
                <Box key={index} p={3} bg="gray.50" borderRadius="md" borderWidth="1px">
                  <Text fontWeight="bold">{cert.certificate_name}</Text>
                  <Text fontSize="sm" color="gray.600">{cert.issuing_organization}</Text>
                  <Text fontSize="sm" color="gray.600">{cert.issue_date}</Text>
                  {cert.certificate_url && (
                    <Text fontSize="sm" textDecoration="underline">{cert.certificate_url}</Text>
                  )}
                </Box>
              ))
            )}
          </VStack>
        ) : (
          <VStack align="stretch" spacing={3}>
            {(formData.certifications || []).map((cert, index) => (
              <Box key={index} p={3} bg="blue.50" borderRadius="md" borderWidth="1px">
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="bold" fontSize="sm">Certification {index + 1}</Text>
                  <IconButton 
                    icon={<FiTrash2 />} 
                    size="xs" 
                    variant="outline"
                    onClick={() => removeCertification(index)}
                  />
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                  <FormControl>
                    <FormLabel fontSize="sm">Certificate Name</FormLabel>
                    <Input 
                      size="sm"
                      value={cert.certificate_name}
                      onChange={(e) => updateCertification(index, 'certificate_name', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Issuing Organization</FormLabel>
                    <Input 
                      size="sm"
                      value={cert.issuing_organization}
                      onChange={(e) => updateCertification(index, 'issuing_organization', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Issue Date</FormLabel>
                    <Input 
                      size="sm"
                      type="date"
                      value={cert.issue_date}
                      onChange={(e) => updateCertification(index, 'issue_date', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Certificate URL</FormLabel>
                    <Input 
                      size="sm"
                      value={cert.certificate_url}
                      onChange={(e) => updateCertification(index, 'certificate_url', e.target.value)}
                      placeholder="Optional"
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      {/* Workshops & Trainings */}
      <Box>
        <HStack justify="space-between" mb={3}>
          <Text fontWeight="semibold">Workshops & Trainings</Text>
          {isEditing && (
            <Button 
              leftIcon={<FiPlus />} 
              size="xs" 
              variant="outline"
              onClick={addWorkshop}
            >
              Add Workshop
            </Button>
          )}
        </HStack>

        {!isEditing ? (
          <VStack align="stretch" spacing={3}>
            {(profileData?.editable?.workshops_trainings || []).length === 0 ? (
              <Text color="gray.500" fontSize="sm">No workshops added</Text>
            ) : (
              (profileData?.editable?.workshops_trainings || []).map((workshop, index) => (
                <Box key={index} p={3} bg="gray.50" borderRadius="md" borderWidth="1px">
                  <Text fontWeight="bold">{workshop.workshop_name}</Text>
                  <Text fontSize="sm" color="gray.600">{workshop.organizer}</Text>
                  <Text fontSize="sm" color="gray.600">{workshop.date_attended}</Text>
                </Box>
              ))
            )}
          </VStack>
        ) : (
          <VStack align="stretch" spacing={3}>
            {(formData.workshops_trainings || []).map((workshop, index) => (
              <Box key={index} p={3} bg="purple.50" borderRadius="md" borderWidth="1px">
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="bold" fontSize="sm">Workshop {index + 1}</Text>
                  <IconButton 
                    icon={<FiTrash2 />} 
                    size="xs" 
                    variant="outline"
                    onClick={() => removeWorkshop(index)}
                  />
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2}>
                  <FormControl>
                    <FormLabel fontSize="sm">Workshop Name</FormLabel>
                    <Input 
                      size="sm"
                      value={workshop.workshop_name}
                      onChange={(e) => updateWorkshop(index, 'workshop_name', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Organizer</FormLabel>
                    <Input 
                      size="sm"
                      value={workshop.organizer}
                      onChange={(e) => updateWorkshop(index, 'organizer', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Date Attended</FormLabel>
                    <Input 
                      size="sm"
                      type="date"
                      value={workshop.date_attended}
                      onChange={(e) => updateWorkshop(index, 'date_attended', e.target.value)}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </VStack>
  );
}

export default CertificationsSection;
