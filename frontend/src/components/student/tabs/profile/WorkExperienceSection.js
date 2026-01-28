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
  Divider,
  SimpleGrid,
  Textarea,
} from '@chakra-ui/react';
import { FiEdit, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

function WorkExperienceSection({ profileData, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const handleEdit = () => {
    setFormData({
      internships: profileData?.editable?.internships || [],
      projects: profileData?.editable?.projects || [],
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate('work_experience', formData);
      setIsEditing(false);
      toast({
        title: 'Work experience updated',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error updating work experience',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const addInternship = () => {
    setFormData({
      ...formData,
      internships: [
        ...(formData.internships || []),
        {
          company_name: '',
          role: '',
          duration: '',
          description: '',
        }
      ]
    });
  };

  const updateInternship = (index, field, value) => {
    const updated = [...formData.internships];
    updated[index][field] = value;
    setFormData({...formData, internships: updated});
  };

  const removeInternship = (index) => {
    const updated = formData.internships.filter((_, i) => i !== index);
    setFormData({...formData, internships: updated});
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...(formData.projects || []),
        {
          project_title: '',
          technologies_used: '',
          description: '',
          project_link: '',
        }
      ]
    });
  };

  const updateProject = (index, field, value) => {
    const updated = [...formData.projects];
    updated[index][field] = value;
    setFormData({...formData, projects: updated});
  };

  const removeProject = (index) => {
    const updated = formData.projects.filter((_, i) => i !== index);
    setFormData({...formData, projects: updated});
  };

  return (
    <VStack align="stretch" spacing={6}>
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold" color="black">Work Experience & Projects</Text>
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

      {/* Internships */}
      <Box>
        <HStack justify="space-between" mb={3}>
          <Text fontWeight="semibold">Internships</Text>
          {isEditing && (
            <Button 
              leftIcon={<FiPlus />} 
              size="xs" 
              variant="outline"
              onClick={addInternship}
            >
              Add Internship
            </Button>
          )}
        </HStack>

        {!isEditing ? (
          <VStack align="stretch" spacing={4}>
            {(profileData?.editable?.internships || []).length === 0 ? (
              <Text color="gray.500" fontSize="sm">No internships added</Text>
            ) : (
              (profileData?.editable?.internships || []).map((internship, index) => (
                <Box key={index} p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
                  <Text fontWeight="bold">{internship.role}</Text>
                  <Text fontSize="sm" color="gray.600">{internship.company_name}</Text>
                  <Text fontSize="sm" color="gray.600">{internship.duration}</Text>
                  <Text fontSize="sm" mt={2}>{internship.description}</Text>
                </Box>
              ))
            )}
          </VStack>
        ) : (
          <VStack align="stretch" spacing={4}>
            {(formData.internships || []).map((internship, index) => (
              <Box key={index} p={4} bg="blue.50" borderRadius="md" borderWidth="1px">
                <HStack justify="space-between" mb={3}>
                  <Text fontWeight="bold" fontSize="sm">Internship {index + 1}</Text>
                  <IconButton 
                    icon={<FiTrash2 />} 
                    size="xs" 
                    variant="outline"
                    onClick={() => removeInternship(index)}
                  />
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  <FormControl>
                    <FormLabel fontSize="sm">Company Name</FormLabel>
                    <Input 
                      size="sm"
                      value={internship.company_name}
                      onChange={(e) => updateInternship(index, 'company_name', e.target.value)}
                      placeholder="Company name"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Role</FormLabel>
                    <Input 
                      size="sm"
                      value={internship.role}
                      onChange={(e) => updateInternship(index, 'role', e.target.value)}
                      placeholder="Your role"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Duration</FormLabel>
                    <Input 
                      size="sm"
                      value={internship.duration}
                      onChange={(e) => updateInternship(index, 'duration', e.target.value)}
                      placeholder="e.g., June 2023 - August 2023"
                    />
                  </FormControl>
                </SimpleGrid>
                <FormControl mt={3}>
                  <FormLabel fontSize="sm">Description</FormLabel>
                  <Textarea 
                    size="sm"
                    value={internship.description}
                    onChange={(e) => updateInternship(index, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements"
                    rows={3}
                  />
                </FormControl>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      <Divider />

      {/* Projects */}
      <Box>
        <HStack justify="space-between" mb={3}>
          <Text fontWeight="semibold">Projects</Text>
          {isEditing && (
            <Button 
              leftIcon={<FiPlus />} 
              size="xs" 
              variant="outline"
              onClick={addProject}
            >
              Add Project
            </Button>
          )}
        </HStack>

        {!isEditing ? (
          <VStack align="stretch" spacing={4}>
            {(profileData?.editable?.projects || []).length === 0 ? (
              <Text color="gray.500" fontSize="sm">No projects added</Text>
            ) : (
              (profileData?.editable?.projects || []).map((project, index) => (
                <Box key={index} p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
                  <Text fontWeight="bold">{project.project_title}</Text>
                  <Text fontSize="sm" color="gray.600" mt={1}>{project.technologies_used}</Text>
                  <Text fontSize="sm" mt={2}>{project.description}</Text>
                  {project.project_link && (
                    <Text fontSize="sm" mt={1} textDecoration="underline">
                      Link: {project.project_link}
                    </Text>
                  )}
                </Box>
              ))
            )}
          </VStack>
        ) : (
          <VStack align="stretch" spacing={4}>
            {(formData.projects || []).map((project, index) => (
              <Box key={index} p={4} bg="green.50" borderRadius="md" borderWidth="1px">
                <HStack justify="space-between" mb={3}>
                  <Text fontWeight="bold" fontSize="sm">Project {index + 1}</Text>
                  <IconButton 
                    icon={<FiTrash2 />} 
                    size="xs" 
                    variant="outline"
                    onClick={() => removeProject(index)}
                  />
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  <FormControl>
                    <FormLabel fontSize="sm">Project Title</FormLabel>
                    <Input 
                      size="sm"
                      value={project.project_title}
                      onChange={(e) => updateProject(index, 'project_title', e.target.value)}
                      placeholder="Project name"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Technologies Used</FormLabel>
                    <Input 
                      size="sm"
                      value={project.technologies_used}
                      onChange={(e) => updateProject(index, 'technologies_used', e.target.value)}
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                  </FormControl>
                  <FormControl gridColumn={{ base: '1', md: '1 / -1' }}>
                    <FormLabel fontSize="sm">Project Link (Optional)</FormLabel>
                    <Input 
                      size="sm"
                      value={project.project_link}
                      onChange={(e) => updateProject(index, 'project_link', e.target.value)}
                      placeholder="GitHub/Demo link"
                    />
                  </FormControl>
                </SimpleGrid>
                <FormControl mt={3}>
                  <FormLabel fontSize="sm">Description</FormLabel>
                  <Textarea 
                    size="sm"
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    placeholder="Describe the project, your role, and outcomes"
                    rows={3}
                  />
                </FormControl>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </VStack>
  );
}

export default WorkExperienceSection;
