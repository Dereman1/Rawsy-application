import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput as RNTextInput, ActivityIndicator } from 'react-native';
import { Text, Appbar, List, Surface, useTheme as usePaperTheme } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from 'expo-router';
import api from '../services/api';

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  tags?: string[];
}

const HelpSupportScreen: React.FC = () => {
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();
  const { t } = useLanguage();
  const router = useRouter();

  const [search, setSearch] = useState<string>('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFAQs();
  }, []);

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

      <ScrollView style={styles.content}>
        {/* Search / Question input */}
        <Surface style={[styles.searchContainer, { backgroundColor: paperTheme.colors.surface }]}>
          <RNTextInput
            placeholder={t('askQuestion') ?? "Type your question..."}
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: paperTheme.colors.onSurface }]}
          />
        </Surface>

        {/* Loading state */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={paperTheme.colors.primary} />
            <Text style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 12 }}>
              Loading FAQs...
            </Text>
          </View>
        )}

        {/* Error state */}
        {error && !loading && (
          <Surface style={[styles.errorContainer, { backgroundColor: paperTheme.colors.errorContainer }]}>
            <Text style={{ color: paperTheme.colors.error, padding: 16 }}>
              {error}
            </Text>
          </Surface>
        )}

        {/* FAQ list */}
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
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
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
});
