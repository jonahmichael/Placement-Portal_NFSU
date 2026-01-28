import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
} from '@chakra-ui/react';

// Import profile sub-sections
import PersonalDetailsSection from './profile/PersonalDetailsSection';
import AcademicDetailsSection from './profile/AcademicDetailsSection';
import EducationalHistorySection from './profile/EducationalHistorySection';
import SkillsInterestsSection from './profile/SkillsInterestsSection';
import WorkExperienceSection from './profile/WorkExperienceSection';
import AchievementsSection from './profile/AchievementsSection';
import CertificationsSection from './profile/CertificationsSection';
import PreferencesSection from './profile/PreferencesSection';
import LinksSection from './profile/LinksSection';
import DocumentsSection from './profile/DocumentsSection';

function MyProfileTab({ studentData, onUpdate }) {
  const [masterProfile, setMasterProfile] = useState(null);
  const [editableProfile, setEditableProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const cardBg = 'white';

  useEffect(() => {
    // Use the studentData passed from parent instead of fetching again
    if (studentData) {
      setMasterProfile(studentData);
      setEditableProfile(studentData.editable || {});
      setLoading(false);
    }
  }, [studentData]);

  const handleUpdateProfile = async (section, data) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('No access token found');
        return;
      }

      // Update editable profile
      const response = await fetch('http://localhost:5000/api/student/profile/editable', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      console.log('Profile updated successfully:', section);
      
      // Refresh data from parent
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <Card bg={cardBg} borderWidth="1px" borderColor="gray.200">
      <CardBody>
        <Tabs variant="line" isLazy>
          <TabList flexWrap="wrap" mb={6}>
            <Tab>Personal</Tab>
            <Tab>Academic</Tab>
            <Tab>Education History</Tab>
            <Tab>Skills & Interests</Tab>
            <Tab>Work & Experience</Tab>
            <Tab>Achievements</Tab>
            <Tab>Certifications</Tab>
            <Tab>Preferences</Tab>
            <Tab>Links</Tab>
            <Tab>Documents</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <PersonalDetailsSection 
                masterProfile={masterProfile}
                editableProfile={editableProfile}
                onUpdate={(data) => handleUpdateProfile('personal', data)}
                loading={loading}
              />
            </TabPanel>

            <TabPanel>
              <AcademicDetailsSection 
                masterProfile={masterProfile}
                onUpdate={(data) => handleUpdateProfile('academic', data)}
                loading={loading}
              />
            </TabPanel>

            <TabPanel>
              <EducationalHistorySection 
                masterProfile={masterProfile}
                onUpdate={(data) => handleUpdateProfile('education', data)}
                loading={loading}
              />
            </TabPanel>

            <TabPanel>
              <SkillsInterestsSection 
                editableProfile={editableProfile}
                onUpdate={(data) => handleUpdateProfile('skills', data)}
                loading={loading}
              />
            </TabPanel>

            <TabPanel>
              <WorkExperienceSection 
                editableProfile={editableProfile}
                onUpdate={(data) => handleUpdateProfile('experience', data)}
                loading={loading}
              />
            </TabPanel>

            <TabPanel>
              <AchievementsSection 
                editableProfile={editableProfile}
                onUpdate={(data) => handleUpdateProfile('achievements', data)}
                loading={loading}
              />
            </TabPanel>

            <TabPanel>
              <CertificationsSection 
                editableProfile={editableProfile}
                onUpdate={(data) => handleUpdateProfile('certifications', data)}
                loading={loading}
              />
            </TabPanel>

            <TabPanel>
              <PreferencesSection 
                editableProfile={editableProfile}
                onUpdate={(data) => handleUpdateProfile('preferences', data)}
                loading={loading}
              />
            </TabPanel>

            <TabPanel>
              <LinksSection 
                editableProfile={editableProfile}
                onUpdate={(data) => handleUpdateProfile('links', data)}
                loading={loading}
              />
            </TabPanel>

            <TabPanel>
              <DocumentsSection 
                editableProfile={editableProfile}
                onUpdate={(data) => handleUpdateProfile('documents', data)}
                loading={loading}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
}

export default MyProfileTab;
