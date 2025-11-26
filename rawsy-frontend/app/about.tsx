import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Appbar, Surface, useTheme as usePaperTheme } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from 'expo-router';

const AboutScreen: React.FC = () => {
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('about') ?? 'About'} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Card Wrapper */}
        <Surface style={[styles.card, { backgroundColor: paperTheme.colors.surface }]} elevation={1}>
          {/* Logo */}
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
          />

          <Text variant="headlineSmall" style={[styles.title, { color: paperTheme.colors.onSurface }]}>
            {t('aboutAppTitle') ?? 'About Rawsy'}
          </Text>

          {/* Description */}
          <Text variant="bodyMedium" style={[styles.description, { color: paperTheme.colors.onSurfaceVariant }]}>
            Rawsy is a secure verification platform designed to simplify
            document authentication and identity validation with speed and reliability.
          </Text>
        </Surface>

        {/* Features Section */}
        <Surface style={[styles.card, { backgroundColor: paperTheme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>
            {t('keyFeatures') ?? 'Key Features'}
          </Text>

          <Text style={[styles.listItem, { color: paperTheme.colors.onSurfaceVariant }]}>• Fast and secure verification</Text>
          <Text style={[styles.listItem, { color: paperTheme.colors.onSurfaceVariant }]}>• Cloud-based file storage</Text>
          <Text style={[styles.listItem, { color: paperTheme.colors.onSurfaceVariant }]}>• Real-time validation</Text>
          <Text style={[styles.listItem, { color: paperTheme.colors.onSurfaceVariant }]}>• Smooth user experience</Text>
        </Surface>

        {/* Developer Section */}
        <Surface style={[styles.card, { backgroundColor: paperTheme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>
            Developer
          </Text>

          <Text style={[styles.description, { color: paperTheme.colors.onSurfaceVariant }]}>
            Developed by Dere using React Native, Node.js and modern cloud technologies.
          </Text>
        </Surface>

        {/* Version */}
        <Text style={[styles.version, { color: paperTheme.colors.outline }]}>
          App Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  listItem: {
    fontSize: 15,
    marginBottom: 6,
  },
  version: {
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
});
