'use server';

import { saveLead } from "@/lib/github";

export async function submitContactForm(formData: FormData, lang: string) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { success: false, error: 'All fields are required.' };
  }

  const result = await saveLead({ name, email, message, language: lang });
  return result;
}
