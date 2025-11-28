import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput as RNTextInput, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Text, Appbar, List, Surface, useTheme as usePaperTheme, SegmentedButtons, TextInput, Button, Card, Chip, Divider } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import api from '../services/api';

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  tags?: string[];
}

interface Ticket {
  _id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  adminReply?: string;
  attachments?: Array<{ filename: string; url: string }>;
  adminAttachments?: Array<{ filename: string; url: string }>;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

const HelpSupportScreen: React.FC = () => {
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();
  const { t } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('faq');
  const [search, setSearch] = useState<string>('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    if (activeTab === 'faq') {
      fetchFAQs();
    } 
  }, [activeTab]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/support/faq');
      setFaqs(response.data.faqs || []);
      setError('');
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  
  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'faq') {
      await fetchFAQs();
    } 
    setRefreshing(false);
  };

  

 
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#f59e0b';
      case 'in_progress':
        return '#3b82f6';
      case 'resolved':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('helpSupport') ?? "Help & Support"} />
      </Appbar.Header>

      <View style={styles.tabContainer}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            { value: 'faq', label: 'FAQs', icon: 'help-circle' },
            { value: 'tickets', label: 'Support Tickets', icon: 'ticket' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[paperTheme.colors.primary]} />
        }
      >
        {activeTab === 'faq' ? (
          <>
            <Surface style={[styles.searchContainer, { backgroundColor: paperTheme.colors.surface }]}>
              <RNTextInput
                placeholder={t('askQuestion') ?? "Type your question..."}
                placeholderTextColor={paperTheme.colors.onSurfaceVariant}
                value={search}
                onChangeText={setSearch}
                style={[styles.searchInput, { color: paperTheme.colors.onSurface }]}
              />
            </Surface>

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={paperTheme.colors.primary} />
                <Text style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 12 }}>
                  Loading FAQs...
                </Text>
              </View>
            )}

            {error && !loading && (
              <Surface style={[styles.errorContainer, { backgroundColor: paperTheme.colors.errorContainer }]}>
                <Text style={{ color: paperTheme.colors.error, padding: 16 }}>
                  {error}
                </Text>
              </Surface>
            )}

            {!loading && !error && (
              <Surface style={[styles.faqContainer, { backgroundColor: paperTheme.colors.surface }]}>
                {filteredFAQs.length === 0 ? (
                  <Text style={{ color: paperTheme.colors.onSurfaceVariant, padding: 16 }}>
                    {t('noResults') ?? "No matching results found."}
                  </Text>
                ) : (
                  filteredFAQs.map((faq, index) => (
                    <List.Accordion
                      key={faq._id || index}
                      title={faq.question}
                      titleStyle={{ color: paperTheme.colors.onSurface }}
                      style={{ backgroundColor: paperTheme.colors.surface }}
                    >
                      <List.Item
                        title={faq.answer}
                        titleNumberOfLines={10}
                        titleStyle={{ color: paperTheme.colors.onSurfaceVariant }}
                      />
                    </List.Accordion>
                  ))
                )}
              </Surface>
            )}
          </>
        ) : (
          <>
            <Surface style={[styles.emptyContainer, { backgroundColor: paperTheme.colors.surface }]}>
              <Text style={{ color: paperTheme.colors.onSurfaceVariant }}>
                {t('noTickets') ?? "No support tickets to display."}
              </Text>
            </Surface>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 0,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    fontSize: 16,
    height: 40,
  },
  faqContainer: {
    borderRadius: 12,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  errorContainer: {
    borderRadius: 8,
    marginBottom: 16,
  },
  
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  
  attachButton: {
    marginBottom: 8,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  fileName: {
    flex: 1,
  },
  submitButton: {
    paddingVertical: 6,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  ticketsList: {
    gap: 12,
  },
  ticketCard: {
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ticketSubject: {
    flex: 1,
    fontWeight: '600',
    marginRight: 12,
  },
  ticketDate: {
    marginBottom: 8,
  },
  ticketDivider: {
    marginVertical: 12,
  },
  ticketMessage: {
    lineHeight: 20,
    marginBottom: 8,
  },
  attachmentsSection: {
    marginTop: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  adminReplyBox: {
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  adminReplyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  adminReplyText: {
    lineHeight: 20,
  },
  resolvedText: {
    marginTop: 8,
    fontWeight: '500',
  },
});
