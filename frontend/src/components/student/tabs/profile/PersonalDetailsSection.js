import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  Divider,
  useToast,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiX } from 'react-icons/fi';

function PersonalDetailsSection({ masterProfile, editableProfile, onUpdate, loading }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const handleEdit = () => {
    setFormData({
      personal_email: editableProfile?.personal_email || '',
      mobile_number: masterProfile?.mobile_number || '',
      alternate_mobile_number: editableProfile?.alternate_mobile_number || '',
      emergency_contact_number: editableProfile?.emergency_contact_number || '',
      permanent_address: masterProfile?.permanent_address || '',
      current_address: masterProfile?.current_address || '',
      city: masterProfile?.city || '',
      state: masterProfile?.state || '',
      pincode: masterProfile?.pincode || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate(formData);
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        description: 'Your personal details have been saved successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="md" color="black">Personal Details</Heading>
        {!isEditing ? (
          <Button leftIcon={<FiEdit />} variant="outline" size="sm" onClick={handleEdit}>
            Edit
          </Button>
        ) : (
          <HStack>
            <Button leftIcon={<FiSave />} variant="solid" bg="black" color="white" _hover={{ bg: 'gray.700' }} size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button leftIcon={<FiX />} variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </HStack>
        )}
      </HStack>

      <Divider />

      {/* Non-Editable Fields */}
      <Box>
        <Text fontSize="sm" fontWeight="bold" mb={3} color="gray.600">
          Basic Information (Non-editable)
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm">Full Name</FormLabel>
            <Input value={masterProfile?.full_name || 'N/A'} isReadOnly bg="gray.50" />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Roll Number</FormLabel>
            <Input value={masterProfile?.roll_number || 'N/A'} isReadOnly bg="gray.50" />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Enrollment Number</FormLabel>
            <Input value={masterProfile?.enrollment_number || 'N/A'} isReadOnly bg="gray.50" />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Gender</FormLabel>
            <Input value={masterProfile?.gender || 'N/A'} isReadOnly bg="gray.50" />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Date of Birth</FormLabel>
            <Input value={masterProfile?.date_of_birth || 'N/A'} isReadOnly bg="gray.50" />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Nationality</FormLabel>
            <Input value={masterProfile?.nationality || 'N/A'} isReadOnly bg="gray.50" />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Category</FormLabel>
            <Input value={masterProfile?.category || 'N/A'} isReadOnly bg="gray.50" />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Aadhaar Number</FormLabel>
            <Input value={masterProfile?.aadhaar_number ? '****-****-' + masterProfile.aadhaar_number.slice(-4) : 'N/A'} isReadOnly bg="gray.50" />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Father's Name</FormLabel>
            <Input value={masterProfile?.father_name || 'N/A'} isReadOnly bg="gray.50" />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Mother's Name</FormLabel>
            <Input value={masterProfile?.mother_name || 'N/A'} isReadOnly bg="gray.50" />
          </FormControl>
        </SimpleGrid>
      </Box>

      <Divider />

      {/* Editable Fields */}
      <Box>
        <Text fontSize="sm" fontWeight="bold" mb={3} color="gray.600">
          Contact Information {isEditing && <Badge variant="outline" ml={2} color="black">Editing</Badge>}
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm">Personal Email</FormLabel>
            <Input 
              value={isEditing ? formData.personal_email : (editableProfile?.personal_email || 'Not provided')}
              onChange={(e) => setFormData({...formData, personal_email: e.target.value})}
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.50'}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Mobile Number</FormLabel>
            <Input 
              value={isEditing ? formData.mobile_number : (masterProfile?.mobile_number || 'Not provided')}
              onChange={(e) => setFormData({...formData, mobile_number: e.target.value})}
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.50'}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Alternate Mobile Number</FormLabel>
            <Input 
              value={isEditing ? formData.alternate_mobile_number : (editableProfile?.alternate_mobile_number || 'Not provided')}
              onChange={(e) => setFormData({...formData, alternate_mobile_number: e.target.value})}
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.50'}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Emergency Contact</FormLabel>
            <Input 
              value={isEditing ? formData.emergency_contact_number : (editableProfile?.emergency_contact_number || 'Not provided')}
              onChange={(e) => setFormData({...formData, emergency_contact_number: e.target.value})}
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.50'}
            />
          </FormControl>
        </SimpleGrid>
      </Box>

      <Divider />

      {/* Address Information */}
      <Box>
        <Text fontSize="sm" fontWeight="bold" mb={3} color="gray.600">
          Address Information {isEditing && <Badge variant="outline" ml={2} color="black">Editing</Badge>}
        </Text>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm">Permanent Address</FormLabel>
            <Input 
              value={isEditing ? formData.permanent_address : (masterProfile?.permanent_address || 'Not provided')}
              onChange={(e) => setFormData({...formData, permanent_address: e.target.value})}
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.50'}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Current Address</FormLabel>
            <Input 
              value={isEditing ? formData.current_address : (masterProfile?.current_address || 'Not provided')}
              onChange={(e) => setFormData({...formData, current_address: e.target.value})}
              isReadOnly={!isEditing}
              bg={isEditing ? 'white' : 'gray.50'}
            />
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
            <FormControl>
              <FormLabel fontSize="sm">City</FormLabel>
              <Input 
                value={isEditing ? formData.city : (masterProfile?.city || 'Not provided')}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                isReadOnly={!isEditing}
                bg={isEditing ? 'white' : 'gray.50'}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">State</FormLabel>
              <Input 
                value={isEditing ? formData.state : (masterProfile?.state || 'Not provided')}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                isReadOnly={!isEditing}
                bg={isEditing ? 'white' : 'gray.50'}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">Pincode</FormLabel>
              <Input 
                value={isEditing ? formData.pincode : (masterProfile?.pincode || 'Not provided')}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                isReadOnly={!isEditing}
                bg={isEditing ? 'white' : 'gray.50'}
              />
            </FormControl>
          </SimpleGrid>
        </VStack>
      </Box>
    </VStack>
  );
}

export default PersonalDetailsSection;
