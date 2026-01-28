import React, { useState } from 'react';
import {
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  VStack,
  Text,
  useToast,
  Link,
  Icon,
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiX, FiExternalLink } from 'react-icons/fi';

function LinksSection({ profileData, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const handleEdit = () => {
    setFormData({
      linkedin_profile: profileData?.editable?.linkedin_profile || '',
      github_profile: profileData?.editable?.github_profile || '',
      portfolio_website: profileData?.editable?.portfolio_website || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate('links', formData);
      setIsEditing(false);
      toast({
        title: 'Links updated',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error updating links',
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
        <Text fontSize="lg" fontWeight="bold" color="black">Professional Links</Text>
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

      <SimpleGrid columns={{ base: 1 }} spacing={4}>
        <FormControl>
          <FormLabel>LinkedIn Profile</FormLabel>
          {!isEditing ? (
            profileData?.editable?.linkedin_profile ? (
              <Link 
                href={profileData?.editable?.linkedin_profile} 
                isExternal 
                textDecoration="underline"
                display="flex"
                alignItems="center"
              >
                {profileData?.editable?.linkedin_profile}
                <Icon as={FiExternalLink} ml={1} />
              </Link>
            ) : (
              <Text color="gray.500" fontSize="sm">Not provided</Text>
            )
          ) : (
            <Input 
              value={formData.linkedin_profile} 
              onChange={(e) => setFormData({...formData, linkedin_profile: e.target.value})}
              placeholder="https://www.linkedin.com/in/your-profile"
            />
          )}
        </FormControl>

        <FormControl>
          <FormLabel>GitHub Profile</FormLabel>
          {!isEditing ? (
            profileData?.editable?.github_profile ? (
              <Link 
                href={profileData?.editable?.github_profile} 
                isExternal 
                textDecoration="underline"
                display="flex"
                alignItems="center"
              >
                {profileData?.editable?.github_profile}
                <Icon as={FiExternalLink} ml={1} />
              </Link>
            ) : (
              <Text color="gray.500" fontSize="sm">Not provided</Text>
            )
          ) : (
            <Input 
              value={formData.github_profile} 
              onChange={(e) => setFormData({...formData, github_profile: e.target.value})}
              placeholder="https://github.com/your-username"
            />
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Portfolio Website</FormLabel>
          {!isEditing ? (
            profileData?.editable?.portfolio_website ? (
              <Link 
                href={profileData?.editable?.portfolio_website} 
                isExternal 
                textDecoration="underline"
                display="flex"
                alignItems="center"
              >
                {profileData?.editable?.portfolio_website}
                <Icon as={FiExternalLink} ml={1} />
              </Link>
            ) : (
              <Text color="gray.500" fontSize="sm">Not provided</Text>
            )
          ) : (
            <Input 
              value={formData.portfolio_website} 
              onChange={(e) => setFormData({...formData, portfolio_website: e.target.value})}
              placeholder="https://your-portfolio.com"
            />
          )}
        </FormControl>
      </SimpleGrid>
    </VStack>
  );
}

export default LinksSection;
