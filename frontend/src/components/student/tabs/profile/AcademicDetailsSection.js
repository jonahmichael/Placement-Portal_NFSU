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
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiX } from 'react-icons/fi';

function AcademicDetailsSection({ profileData, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const handleEdit = () => {
    // Initialize form with current data from both master and editable profiles
    setFormData({
      backlogs_count: profileData?.editable?.backlogs_count || 0,
      gap_in_education: profileData?.editable?.gap_in_education || null,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate('academic', formData);
      setIsEditing(false);
      toast({
        title: 'Academic details updated',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error updating academic details',
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
        <Text fontSize="lg" fontWeight="bold" color="black">Academic Details</Text>
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
        {/* Non-editable Fields - From students_master */}
        <FormControl>
          <FormLabel>University Name</FormLabel>
          <Input 
            value={profileData?.master?.university_name || ''} 
            isReadOnly 
            bg="gray.100"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Course</FormLabel>
          <Input 
            value={profileData?.master?.course || ''} 
            isReadOnly 
            bg="gray.100"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Branch / Specialization</FormLabel>
          <Input 
            value={profileData?.master?.branch || ''} 
            isReadOnly 
            bg="gray.100"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Semester</FormLabel>
          <Input 
            value={profileData?.master?.semester || ''} 
            isReadOnly 
            bg="gray.100"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Admission Year</FormLabel>
          <Input 
            value={profileData?.master?.admission_year || ''} 
            isReadOnly 
            bg="gray.100"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Expected Passout Year</FormLabel>
          <Input 
            value={profileData?.master?.expected_passout_year || ''} 
            isReadOnly 
            bg="gray.100"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Current CGPA</FormLabel>
          <Input 
            value={profileData?.master?.cgpa || ''} 
            isReadOnly 
            bg="gray.100"
          />
        </FormControl>

        <FormControl>
          <FormLabel>CGPA Scale</FormLabel>
          <Input 
            value={profileData?.master?.cgpa_scale || '10.0'} 
            isReadOnly 
            bg="gray.100"
          />
        </FormControl>

        {/* Editable Fields - From student_profiles_editable */}
        <FormControl>
          <FormLabel>Current Active Backlogs</FormLabel>
          <Input 
            type="number"
            value={isEditing ? formData.backlogs_count : (profileData?.editable?.backlogs_count || 0)} 
            isReadOnly={!isEditing}
            bg={isEditing ? 'white' : 'gray.100'}
            onChange={(e) => setFormData({...formData, backlogs_count: parseInt(e.target.value)})}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Gap in Education (Years)</FormLabel>
          <Input 
            type="number"
            value={isEditing ? (formData.gap_in_education || 0) : (profileData?.editable?.gap_in_education || 0)} 
            isReadOnly={!isEditing}
            bg={isEditing ? 'white' : 'gray.100'}
            onChange={(e) => setFormData({...formData, gap_in_education: parseInt(e.target.value)})}
            placeholder="Enter gap in years (if any)"
          />
        </FormControl>
      </SimpleGrid>
    </VStack>
  );
}

export default AcademicDetailsSection;
