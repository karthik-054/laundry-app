import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Loading } from '../../components/States';

import { colors, spacing } from '../../app/theme';

import { useCatalogSettingsQuery } from '../laundry/serviceApi';

import {
  useTicketsQuery,
  useCreateTicketMutation,
} from './supportApi';

export function SupportScreen() {
  const {
    data: catalog,
    isLoading: catalogLoading,
  } = useCatalogSettingsQuery();

  const {
    data: tickets,
    isLoading: ticketsLoading,
  } = useTicketsQuery();

  const [
    createTicket,
    { isLoading: creating },
  ] = useCreateTicketMutation();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqs = Array.isArray(catalog?.faqs)
    ? catalog.faqs
    : [];

  const ticketList = Array.isArray(tickets)
    ? tickets
    : [];

  const handleCreateTicket = async () => {
    if (!subject.trim()) {
      Alert.alert(
        'Missing Subject',
        'Please enter a subject.'
      );
      return;
    }

    if (!message.trim()) {
      Alert.alert(
        'Missing Message',
        'Please enter your message.'
      );
      return;
    }

    try {
      await createTicket({
        category: 'general',
        subject: subject.trim(),
        message: message.trim(),
      }).unwrap();

      setSubject('');
      setMessage('');

      Alert.alert(
        'Sent',
        'Your support ticket has been created.'
      );
    } catch (error: any) {
      console.log(
        'Create Ticket Error:',
        error
      );

      Alert.alert(
        'Could not send',
        error?.data?.message ||
          error?.error ||
          'Please try again.'
      );
    }
  };

  if (
    catalogLoading ||
    ticketsLoading
  ) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>
        Support
      </Text>

      {/* FAQ */}

      <Text style={styles.section}>
        FAQ
      </Text>

      {faqs.length === 0 ? (
        <Card style={styles.card}>
          <Text style={styles.emptyText}>
            No FAQs available.
          </Text>
        </Card>
      ) : (
        faqs.map((faq: any) => (
          <Card
            key={faq.id}
            style={styles.card}
          >
            <Text style={styles.question}>
              {faq.question}
            </Text>

            <Text style={styles.answer}>
              {faq.answer}
            </Text>
          </Card>
        ))
      )}

      {/* NEW TICKET */}

      <Text style={styles.section}>
        New Ticket
      </Text>

      <Input
        label="Subject"
        value={subject}
        onChangeText={setSubject}
        placeholder="Enter your issue"
      />

      <View style={styles.spacing} />

      <Input
        label="Message"
        value={message}
        onChangeText={setMessage}
        placeholder="Describe your issue"
      />

      <View style={styles.buttonSpacing} />

      <Button
        title={
          creating
            ? 'Sending...'
            : 'Send to Studio'
        }
        onPress={handleCreateTicket}
        disabled={creating}
      />

      {/* TICKETS */}

      <Text style={styles.section}>
        Your Tickets
      </Text>

      {ticketList.length === 0 ? (
        <Card style={styles.card}>
          <Text style={styles.emptyText}>
            You don't have any support tickets yet.
          </Text>
        </Card>
      ) : (
        ticketList.map(ticket => (
          <Card
            key={ticket.id}
            style={styles.card}
          >
            <Text style={styles.question}>
              {ticket.subject}
            </Text>

            <Text style={styles.status}>
              {ticket.status} · {ticket.category}
            </Text>

            <Text style={styles.answer}>
              {ticket.message}
            </Text>
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
  },

  section: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: spacing.lg,
    marginBottom: 10,
    color: colors.ink,
  },

  card: {
    marginBottom: 10,
  },

  question: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },

  answer: {
    color: colors.muted,
    marginTop: 6,
    lineHeight: 20,
  },

  status: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 5,
  },

  emptyText: {
    color: colors.muted,
    textAlign: 'center',
  },

  spacing: {
    height: 10,
  },

  buttonSpacing: {
    height: 14,
  },
});