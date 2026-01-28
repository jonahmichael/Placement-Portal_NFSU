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
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiX } from 'react-icons/fi';

function EducationalHistorySection({ profileData, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const handleEdit = () => {
    setFormData({
      tenth_board: profileData?.editable?.tenth_board || '',
      tenth_marks_percentage: profileData?.editable?.tenth_marks_percentage || '',
      tenth_passout_year: profileData?.editable?.tenth_passout_year || '',
      twelfth_board: profileData?.editable?.twelfth_board || '',
      twelfth_marks_percentage: profileData?.editable?.twelfth_marks_percentage || '',
      twelfth_passout_year: profileData?.editable?.twelfth_passout_year || '',
      diploma_stream: profileData?.editable?.diploma_stream || '',
      diploma_marks_percentage: profileData?.editable?.diploma_marks_percentage || '',
      diploma_passout_year: profileData?.editable?.diploma_passout_year || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate('educational_history', formData);
      setIsEditing(false);
      toast({
        title: 'Educational history updated',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error updating educational history',
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
    <VStack align="stretch" spacing={6}>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold" color="black">Educational History</Text>
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

      {/* 10th Standard */}
      <Box>
        <Text fontWeight="semibold" mb={3}>10th Standard / SSC</Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel>Board</FormLabel>
            <Input 
              value={isEditing ? formData.tenth_board : (profileData?.editable?.tenth_board || '')} 
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.100'}
              onChange={(e) => setFormData({...formData, tenth_board: e.target.value})}
              placeholder="e.g., CBSE, GSEB"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Percentage / CGPA</FormLabel>
            <Input 
              type="number"
              step="0.01"
              value={isEditing ? formData.tenth_marks_percentage : (profileData?.editable?.tenth_marks_percentage || '')} 
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.100'}
              onChange={(e) => setFormData({...formData, tenth_marks_percentage: parseFloat(e.target.value)})}
              placeholder="Enter percentage"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Passout Year</FormLabel>
            <Input 
              type="number"
              value={isEditing ? formData.tenth_passout_year : (profileData?.editable?.tenth_passout_year || '')} 
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.100'}
              onChange={(e) => setFormData({...formData, tenth_passout_year: parseInt(e.target.value)})}
              placeholder="e.g., 2018"
            />
          </FormControl>
        </SimpleGrid>
      </Box>

      {/* 12th Standard */}
      <Box>
        <Text fontWeight="semibold" mb={3}>12th Standard / HSC</Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel>Board</FormLabel>
            <Input 
              value={isEditing ? formData.twelfth_board : (profileData?.editable?.twelfth_board || '')} 
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.100'}
              onChange={(e) => setFormData({...formData, twelfth_board: e.target.value})}
              placeholder="e.g., CBSE, GSEB"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Percentage / CGPA</FormLabel>
            <Input 
              type="number"
              step="0.01"
              value={isEditing ? formData.twelfth_marks_percentage : (profileData?.editable?.twelfth_marks_percentage || '')} 
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.100'}
              onChange={(e) => setFormData({...formData, twelfth_marks_percentage: parseFloat(e.target.value)})}
              placeholder="Enter percentage"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Passout Year</FormLabel>
            <Input 
              type="number"
              value={isEditing ? formData.twelfth_passout_year : (profileData?.editable?.twelfth_passout_year || '')} 
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.100'}
              onChange={(e) => setFormData({...formData, twelfth_passout_year: parseInt(e.target.value)})}
              placeholder="e.g., 2020"
            />
          </FormControl>
        </SimpleGrid>
      </Box>

      {/* Diploma (Optional) */}
      <Box>
        <Text fontWeight="semibold" mb={3}>Diploma (If Applicable)</Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel>Stream / Branch</FormLabel>
            <Input 
              value={isEditing ? formData.diploma_stream : (profileData?.editable?.diploma_stream || '')} 
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.100'}
              onChange={(e) => setFormData({...formData, diploma_stream: e.target.value})}
              placeholder="e.g., Computer Engineering"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Percentage / CGPA</FormLabel>
            <Input 
              type="number"
              step="0.01"
              value={isEditing ? formData.diploma_marks_percentage : (profileData?.editable?.diploma_marks_percentage || '')} 
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.100'}
              onChange={(e) => setFormData({...formData, diploma_marks_percentage: parseFloat(e.target.value)})}
              placeholder="Enter percentage"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Passout Year</FormLabel>
            <Input 
              type="number"
              value={isEditing ? formData.diploma_passout_year : (profileData?.editable?.diploma_passout_year || '')} 
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.100'}
              onChange={(e) => setFormData({...formData, diploma_passout_year: parseInt(e.target.value)})}
              placeholder="e.g., 2020"
            />
          </FormControl>
        </SimpleGrid>
      </Box>
    </VStack>
  );
}

export default EducationalHistorySection;
