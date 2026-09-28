import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  danger: '#DC2626',
  background: '#F4F6FA',
  surface: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#D1D5DB',
  placeholder: '#9CA3AF',
};

export const globalStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  authContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },

  // Tipografia
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: -6,
  },
  textMuted: {
    fontSize: 14,
    color: colors.textMuted,
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    padding: 8,
  },

  // Formulário
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },

  // Botões
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonOutlineText: {
    color: colors.primary,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  headerButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 8,
  },

  // Lista de contatos
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  cardActions: {
    gap: 6,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // Foto
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.border,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    backgroundColor: colors.border,
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
});
