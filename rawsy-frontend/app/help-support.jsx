import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Text, Appbar, List, Surface, useTheme as usePaperTheme } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from 'expo-router';

const FAQS = [
  {
    question: "How do I reset my password?",
    answer: "Go to your profile, tap 'Change Password', and follow the instructions."
  },
  {
    question: "How do I upload verification documents?",
    answer: "Go to the Upload Verification section in your account and submit the required files."
  },
  {
    question: "How can I contact support?",
    answer: "You can email support@rawsy.com or use the in-app chat feature."
  },
  {
    question: "How do I update my profile?",
    answer: "Navigate to 'Complete Profile' in your account and fill in the updated information."
  }
];

export default function HelpSupportScreen() {
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();
  const { t } = useLanguage();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const filteredFAQs = FAQS.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase())
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
          <TextInput
            placeholder={t('askQuestion') ?? "Type your question..."}
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: paperTheme.colors.onSurface }]}
          />
        </Surface>

        {/* FAQ list */}
        <Surface style={[styles.faqContainer, { backgroundColor: paperTheme.colors.surface }]}>
          {filteredFAQs.length === 0 ? (
            <Text style={{ color: paperTheme.colors.onSurfaceVariant, padding: 16 }}>
              {t('noResults') ?? "No matching results found."}
            </Text>
          ) : (
            filteredFAQs.map((faq, index) => (
              <List.Accordion
                key={index}
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
      </ScrollView>
    </View>
  );
}

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
