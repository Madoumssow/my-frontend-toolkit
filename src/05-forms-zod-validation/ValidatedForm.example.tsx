import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from './FormField';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse e-mail invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterFormExample = ({
  onSubmitData,
}: {
  onSubmitData: (data: RegisterFormData) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmitData)} noValidate>
      <FormField
        label="Nom complet"
        name="fullName"
        registration={register('fullName')}
        error={errors.fullName}
      />
      <FormField
        label="Adresse e-mail"
        name="email"
        type="email"
        registration={register('email')}
        error={errors.email}
      />
      <FormField
        label="Mot de passe"
        name="password"
        type="password"
        registration={register('password')}
        error={errors.password}
      />
      <button type="submit" disabled={isSubmitting}>
        Créer un compte
      </button>
    </form>
  );
};
