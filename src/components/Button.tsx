import { Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { colors, radius, spacing } from '../app/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
};

export function Button({ title, onPress, variant = 'primary', loading, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        (disabled || loading) && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? colors.teal : colors.white} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'ghost' && { color: colors.tealDark },
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: { backgroundColor: colors.teal },
  ghost: { backgroundColor: colors.sand },
  danger: { backgroundColor: colors.danger },
  disabled: { opacity: 0.55 },
  text: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
