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
  Image,
  Icon,
  Link,
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiX, FiUpload, FiFile, FiDownload } from 'react-icons/fi';

function DocumentsSection({ profileData, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const toast = useToast();

  const handleEdit = () => {
    setFormData({
      resume_url: profileData?.editable?.resume_url || '',
      photo_url: profileData?.editable?.photo_url || '',
      tenth_marksheet_url: profileData?.editable?.tenth_marksheet_url || '',
      twelfth_marksheet_url: profileData?.editable?.twelfth_marksheet_url || '',
      diploma_marksheet_url: profileData?.editable?.diploma_marksheet_url || '',
      current_semester_marksheet_url: profileData?.editable?.current_semester_marksheet_url || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // TODO: Implement file upload to server
      // For now, just save URLs
      await onUpdate('documents', formData);
      setIsEditing(false);
      toast({
        title: 'Documents updated',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error updating documents',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
    setFiles({});
  };

  const handleFileChange = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles({...files, [field]: file});
      // TODO: Upload file to server and get URL
      // For now, create a local URL
      const url = URL.createObjectURL(file);
      setFormData({...formData, [field]: url});
    }
  };

  return (
    <VStack align="stretch" spacing={6}>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold" color="black">Documents</Text>
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

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* Profile Photo */}
        <FormControl>
          <FormLabel>Profile Photo</FormLabel>
          {!isEditing ? (
            profileData?.editable?.photo_url ? (
              <Box>
                <Image 
                  src={profileData?.editable?.photo_url} 
                  alt="Profile" 
                  boxSize="150px" 
                  objectFit="cover"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                />
                <Link 
                  href={profileData?.editable?.photo_url} 
                  isExternal 
                  textDecoration="underline"
                  fontSize="sm"
                  mt={2}
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FiDownload} mr={1} />
                  Download
                </Link>
              </Box>
            ) : (
              <Text color="gray.500" fontSize="sm">No photo uploaded</Text>
            )
          ) : (
            <VStack align="start" spacing={2}>
              {formData.photo_url && (
                <Image 
                  src={formData.photo_url} 
                  alt="Profile Preview" 
                  boxSize="150px" 
                  objectFit="cover"
                  borderRadius="md"
                />
              )}
              <Input 
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('photo_url', e)}
                size="sm"
              />
              <Text fontSize="xs" color="gray.500">
                Max size: 2MB. Formats: JPG, PNG
              </Text>
            </VStack>
          )}
        </FormControl>

        {/* Resume */}
        <FormControl>
          <FormLabel>Resume / CV</FormLabel>
          {!isEditing ? (
            profileData?.editable?.resume_url ? (
              <VStack align="start" spacing={2}>
                <HStack>
                  <Icon as={FiFile} boxSize={5} />
                  <Text fontSize="sm">Resume.pdf</Text>
                </HStack>
                <Link 
                  href={profileData?.editable?.resume_url} 
                  isExternal 
                  textDecoration="underline"
                  fontSize="sm"
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FiDownload} mr={1} />
                  Download
                </Link>
              </VStack>
            ) : (
              <Text color="gray.500" fontSize="sm">No resume uploaded</Text>
            )
          ) : (
            <VStack align="start" spacing={2}>
              {formData.resume_url && (
                <HStack>
                  <Icon as={FiFile} />
                  <Text fontSize="sm">New resume selected</Text>
                </HStack>
              )}
              <Input 
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange('resume_url', e)}
                size="sm"
              />
              <Text fontSize="xs" color="gray.500">
                Max size: 5MB. Formats: PDF, DOC, DOCX
              </Text>
            </VStack>
          )}
        </FormControl>

        {/* 10th Marksheet */}
        <FormControl>
          <FormLabel>10th Standard Marksheet</FormLabel>
          {!isEditing ? (
            profileData?.editable?.tenth_marksheet_url ? (
              <Link 
                href={profileData?.editable?.tenth_marksheet_url} 
                isExternal 
                textDecoration="underline"
                fontSize="sm"
                display="flex"
                alignItems="center"
              >
                <Icon as={FiDownload} mr={1} />
                Download
              </Link>
            ) : (
              <Text color="gray.500" fontSize="sm">Not uploaded</Text>
            )
          ) : (
            <VStack align="start" spacing={2}>
              <Input 
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange('tenth_marksheet_url', e)}
                size="sm"
              />
              <Text fontSize="xs" color="gray.500">PDF only, max 2MB</Text>
            </VStack>
          )}
        </FormControl>

        {/* 12th Marksheet */}
        <FormControl>
          <FormLabel>12th Standard Marksheet</FormLabel>
          {!isEditing ? (
            profileData?.editable?.twelfth_marksheet_url ? (
              <Link 
                href={profileData?.editable?.twelfth_marksheet_url} 
                isExternal 
                textDecoration="underline"
                fontSize="sm"
                display="flex"
                alignItems="center"
              >
                <Icon as={FiDownload} mr={1} />
                Download
              </Link>
            ) : (
              <Text color="gray.500" fontSize="sm">Not uploaded</Text>
            )
          ) : (
            <VStack align="start" spacing={2}>
              <Input 
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange('twelfth_marksheet_url', e)}
                size="sm"
              />
              <Text fontSize="xs" color="gray.500">PDF only, max 2MB</Text>
            </VStack>
          )}
        </FormControl>

        {/* Diploma Marksheet */}
        <FormControl>
          <FormLabel>Diploma Marksheet (if applicable)</FormLabel>
          {!isEditing ? (
            profileData?.editable?.diploma_marksheet_url ? (
              <Link 
                href={profileData?.editable?.diploma_marksheet_url} 
                isExternal 
                textDecoration="underline"
                fontSize="sm"
                display="flex"
                alignItems="center"
              >
                <Icon as={FiDownload} mr={1} />
                Download
              </Link>
            ) : (
              <Text color="gray.500" fontSize="sm">Not uploaded</Text>
            )
          ) : (
            <VStack align="start" spacing={2}>
              <Input 
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange('diploma_marksheet_url', e)}
                size="sm"
              />
              <Text fontSize="xs" color="gray.500">PDF only, max 2MB</Text>
            </VStack>
          )}
        </FormControl>

        {/* Current Semester Marksheet */}
        <FormControl>
          <FormLabel>Latest Semester Marksheet</FormLabel>
          {!isEditing ? (
            profileData?.editable?.current_semester_marksheet_url ? (
              <Link 
                href={profileData?.editable?.current_semester_marksheet_url} 
                isExternal 
                textDecoration="underline"
                fontSize="sm"
                display="flex"
                alignItems="center"
              >
                <Icon as={FiDownload} mr={1} />
                Download
              </Link>
            ) : (
              <Text color="gray.500" fontSize="sm">Not uploaded</Text>
            )
          ) : (
            <VStack align="start" spacing={2}>
              <Input 
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange('current_semester_marksheet_url', e)}
                size="sm"
              />
              <Text fontSize="xs" color="gray.500">PDF only, max 2MB</Text>
            </VStack>
          )}
        </FormControl>
      </SimpleGrid>
    </VStack>
  );
}

export default DocumentsSection;
