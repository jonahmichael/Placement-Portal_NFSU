import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Button,
  HStack,
  VStack,
  Text,
  useToast,
  Textarea,
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiX } from 'react-icons/fi';

function AchievementsSection({ profileData, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const handleEdit = () => {
    setFormData({
      achievements: profileData?.editable?.achievements || '',
      extracurricular_activities: profileData?.editable?.extracurricular_activities || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate('achievements', formData);
      setIsEditing(false);
      toast({
        title: 'Achievements updated',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error updating achievements',
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
        <Text fontSize="lg" fontWeight="bold" color="black">Achievements & Extracurricular Activities</Text>
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

      <FormControl>
        <FormLabel>Achievements & Awards</FormLabel>
        <Textarea 
          value={isEditing ? formData.achievements : (profileData?.editable?.achievements || '')} 
          isReadOnly={!isEditing}
          bg={isEditing ? 'white' : 'gray.100'}
          onChange={(e) => setFormData({...formData, achievements: e.target.value})}
          placeholder="List your achievements, awards, honors, scholarships, etc. (one per line)"
          rows={6}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Extracurricular Activities</FormLabel>
        <Textarea 
          value={isEditing ? formData.extracurricular_activities : (profileData?.editable?.extracurricular_activities || '')} 
          isReadOnly={!isEditing}
          bg={isEditing ? 'white' : 'gray.100'}
          onChange={(e) => setFormData({...formData, extracurricular_activities: e.target.value})}
          placeholder="List your extracurricular activities, clubs, sports, volunteering, etc. (one per line)"
          rows={6}
        />
      </FormControl>
    </VStack>
  );
}

export default AchievementsSection;
