import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  VStack,
  Text,
  useToast,
  Select,
  Checkbox,
  Stack,
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiX } from 'react-icons/fi';

function PreferencesSection({ profileData, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const handleEdit = () => {
    setFormData({
      willingness_relocation: profileData?.editable?.willingness_relocation || false,
      willingness_bond: profileData?.editable?.willingness_bond || false,
      preferred_job_location: profileData?.editable?.preferred_job_location || [],
      preferred_job_type: profileData?.editable?.preferred_job_type || '',
      expected_salary_range: profileData?.editable?.expected_salary_range || '',
      declaration_signed: profileData?.editable?.declaration_signed || false,
      declaration_date: profileData?.editable?.declaration_date || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate('preferences', formData);
      setIsEditing(false);
      toast({
        title: 'Preferences updated',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error updating preferences',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  return (
    <VStack align="stretch" spacing={4}>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold" color="black">Job Preferences & Declarations</Text>
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

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel>Willingness for Relocation</FormLabel>
          {!isEditing ? (
            <Input 
              value={profileData?.editable?.willingness_relocation ? 'Yes' : 'No'} 
              isReadOnly 
              bg="gray.100"
            />
          ) : (
            <Select 
              value={formData.willingness_relocation ? 'yes' : 'no'}
              onChange={(e) => setFormData({...formData, willingness_relocation: e.target.value === 'yes'})}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Willingness to Sign Bond</FormLabel>
          {!isEditing ? (
            <Input 
              value={profileData?.editable?.willingness_bond ? 'Yes' : 'No'} 
              isReadOnly 
              bg="gray.100"
            />
          ) : (
            <Select 
              value={formData.willingness_bond ? 'yes' : 'no'}
              onChange={(e) => setFormData({...formData, willingness_bond: e.target.value === 'yes'})}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Preferred Job Type</FormLabel>
          {!isEditing ? (
            <Input 
              value={profileData?.editable?.preferred_job_type || ''} 
              isReadOnly 
              bg="gray.100"
            />
          ) : (
            <Select 
              value={formData.preferred_job_type}
              onChange={(e) => setFormData({...formData, preferred_job_type: e.target.value})}
            >
              <option value="">Select job type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Any">Any</option>
            </Select>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Expected Salary Range (LPA)</FormLabel>
          <Input 
            value={isEditing ? formData.expected_salary_range : (profileData?.editable?.expected_salary_range || '')} 
            isReadOnly={!isEditing}
            bg={isEditing ? 'white' : 'gray.100'}
            onChange={(e) => setFormData({...formData, expected_salary_range: e.target.value})}
            placeholder="e.g., 5-8 LPA"
          />
        </FormControl>

        <FormControl gridColumn={{ base: '1', md: '1 / -1' }}>
          <FormLabel>Preferred Job Locations</FormLabel>
          <Input 
            value={
              isEditing 
                ? (Array.isArray(formData.preferred_job_location) ? formData.preferred_job_location.join(', ') : formData.preferred_job_location)
                : (Array.isArray(profileData?.editable?.preferred_job_location) 
                    ? profileData?.editable?.preferred_job_location.join(', ') 
                    : profileData?.editable?.preferred_job_location || '')
            } 
            isReadOnly={!isEditing}
            bg={isEditing ? 'white' : 'gray.100'}
            onChange={(e) => setFormData({...formData, preferred_job_location: e.target.value.split(',').map(l => l.trim())})}
            placeholder="e.g., Bangalore, Mumbai, Hyderabad (comma separated)"
          />
        </FormControl>
      </SimpleGrid>

      {/* Declarations */}
      <Box mt={4} p={4} bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200">
        <Text fontWeight="bold" mb={3}>Placement Declarations</Text>
        <Stack spacing={2}>
          <Checkbox 
            isChecked={isEditing ? formData.declaration_signed : (profileData?.editable?.declaration_signed || false)}
            isReadOnly={!isEditing}
            onChange={(e) => setFormData({...formData, declaration_signed: e.target.checked})}
          >
            I declare that all the information provided is true and correct to the best of my knowledge
          </Checkbox>
          <Checkbox 
            isChecked={isEditing ? formData.declaration_signed : (profileData?.editable?.declaration_signed || false)}
            isReadOnly={!isEditing}
          >
            I understand that providing false information may lead to disqualification from placement activities
          </Checkbox>
          <Checkbox 
            isChecked={isEditing ? formData.declaration_signed : (profileData?.editable?.declaration_signed || false)}
            isReadOnly={!isEditing}
          >
            I agree to follow the placement policies and guidelines set by the university
          </Checkbox>
        </Stack>

        {profileData?.editable?.declaration_date && (
          <Text fontSize="sm" color="gray.600" mt={3}>
            Declaration signed on: {new Date(profileData?.editable?.declaration_date).toLocaleDateString()}
          </Text>
        )}
      </Box>
    </VStack>
  );
}

export default PreferencesSection;
