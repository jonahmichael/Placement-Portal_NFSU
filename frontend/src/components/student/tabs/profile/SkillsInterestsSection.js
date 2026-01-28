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
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Textarea,
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiX, FiPlus } from 'react-icons/fi';

function SkillsInterestsSection({ profileData, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newTool, setNewTool] = useState('');
  const toast = useToast();

  const handleEdit = () => {
    setFormData({
      primary_skills: profileData?.editable?.primary_skills || [],
      programming_languages: profileData?.editable?.programming_languages || [],
      tools_technologies: profileData?.editable?.tools_technologies || [],
      domains_of_interest: profileData?.editable?.domains_of_interest || '',
      career_objectives: profileData?.editable?.career_objectives || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate('skills_interests', formData);
      setIsEditing(false);
      toast({
        title: 'Skills & interests updated',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error updating skills & interests',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
    setNewSkill('');
    setNewLanguage('');
    setNewTool('');
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        primary_skills: [...(formData.primary_skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = formData.primary_skills.filter((_, i) => i !== index);
    setFormData({...formData, primary_skills: updatedSkills});
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData({
        ...formData,
        programming_languages: [...(formData.programming_languages || []), newLanguage.trim()]
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (index) => {
    const updatedLanguages = formData.programming_languages.filter((_, i) => i !== index);
    setFormData({...formData, programming_languages: updatedLanguages});
  };

  const addTool = () => {
    if (newTool.trim()) {
      setFormData({
        ...formData,
        tools_technologies: [...(formData.tools_technologies || []), newTool.trim()]
      });
      setNewTool('');
    }
  };

  const removeTool = (index) => {
    const updatedTools = formData.tools_technologies.filter((_, i) => i !== index);
    setFormData({...formData, tools_technologies: updatedTools});
  };

  return (
    <VStack align="stretch" spacing={6}>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold" color="black">Skills & Interests</Text>
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

      {/* Primary Skills */}
      <FormControl>
        <FormLabel>Primary Skills</FormLabel>
        {!isEditing ? (
          <Wrap>
            {(profileData?.editable?.primary_skills || []).map((skill, index) => (
              <WrapItem key={index}>
                <Tag size="lg" variant="outline">
                  <TagLabel>{skill}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
            {(profileData?.editable?.primary_skills || []).length === 0 && (
              <Text color="gray.500" fontSize="sm">No skills added</Text>
            )}
          </Wrap>
        ) : (
          <Box>
            <HStack mb={2}>
              <Input 
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter a skill"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button leftIcon={<FiPlus />} onClick={addSkill} variant="outline">
                Add
              </Button>
            </HStack>
            <Wrap>
              {(formData.primary_skills || []).map((skill, index) => (
                <WrapItem key={index}>
                  <Tag size="lg" variant="outline">
                    <TagLabel>{skill}</TagLabel>
                    <TagCloseButton onClick={() => removeSkill(index)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}
      </FormControl>

      {/* Programming Languages */}
      <FormControl>
        <FormLabel>Programming Languages</FormLabel>
        {!isEditing ? (
          <Wrap>
            {(profileData?.editable?.programming_languages || []).map((lang, index) => (
              <WrapItem key={index}>
                <Tag size="lg" variant="outline">
                  <TagLabel>{lang}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
            {(profileData?.editable?.programming_languages || []).length === 0 && (
              <Text color="gray.500" fontSize="sm">No languages added</Text>
            )}
          </Wrap>
        ) : (
          <Box>
            <HStack mb={2}>
              <Input 
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Enter a programming language"
                onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
              />
              <Button leftIcon={<FiPlus />} onClick={addLanguage} variant="outline">
                Add
              </Button>
            </HStack>
            <Wrap>
              {(formData.programming_languages || []).map((lang, index) => (
                <WrapItem key={index}>
                  <Tag size="lg" variant="outline">
                    <TagLabel>{lang}</TagLabel>
                    <TagCloseButton onClick={() => removeLanguage(index)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}
      </FormControl>

      {/* Tools & Technologies */}
      <FormControl>
        <FormLabel>Tools & Technologies</FormLabel>
        {!isEditing ? (
          <Wrap>
            {(profileData?.editable?.tools_technologies || []).map((tool, index) => (
              <WrapItem key={index}>
                <Tag size="lg" variant="outline">
                  <TagLabel>{tool}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
            {(profileData?.editable?.tools_technologies || []).length === 0 && (
              <Text color="gray.500" fontSize="sm">No tools added</Text>
            )}
          </Wrap>
        ) : (
          <Box>
            <HStack mb={2}>
              <Input 
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                placeholder="Enter a tool or technology"
                onKeyPress={(e) => e.key === 'Enter' && addTool()}
              />
              <Button leftIcon={<FiPlus />} onClick={addTool} variant="outline">
                Add
              </Button>
            </HStack>
            <Wrap>
              {(formData.tools_technologies || []).map((tool, index) => (
                <WrapItem key={index}>
                  <Tag size="lg" variant="outline">
                    <TagLabel>{tool}</TagLabel>
                    <TagCloseButton onClick={() => removeTool(index)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}
      </FormControl>

      {/* Domains of Interest */}
      <FormControl>
        <FormLabel>Domains of Interest</FormLabel>
        <Textarea 
          value={isEditing ? formData.domains_of_interest : (profileData?.editable?.domains_of_interest || '')} 
          isReadOnly={!isEditing}
          bg={isEditing ? 'white' : 'gray.100'}
          onChange={(e) => setFormData({...formData, domains_of_interest: e.target.value})}
          placeholder="e.g., Web Development, Machine Learning, Cloud Computing"
          rows={3}
        />
      </FormControl>

      {/* Career Objectives */}
      <FormControl>
        <FormLabel>Career Objectives</FormLabel>
        <Textarea 
          value={isEditing ? formData.career_objectives : (profileData?.editable?.career_objectives || '')} 
          isReadOnly={!isEditing}
          bg={isEditing ? 'white' : 'gray.100'}
          onChange={(e) => setFormData({...formData, career_objectives: e.target.value})}
          placeholder="Describe your career goals and objectives"
          rows={4}
        />
      </FormControl>
    </VStack>
  );
}

export default SkillsInterestsSection;
