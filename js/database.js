import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkehxbnckvputkucknfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZWh4Ym5ja3ZwdXRrdWNrbmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NDg5NTYsImV4cCI6MjA0OTUyNDk1Nn0.dxiEz3JLVymeGeno_DGg2e1AOqRg5xqDRAWiQTC823A';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchRandomCard() {
    try {
        const { data: cards, error } = await supabase
            .from('cards')
            .select('id, title, content, result, explanation, easy-explanation, category') // Include 'category'
            .limit(10);

        if (error) throw error;

        if (cards && cards.length > 0) {
            return cards[Math.floor(Math.random() * cards.length)];
        }
        return null;
    } catch (error) {
        console.error('Error fetching random card:', error);
        return null;
    }
}

export async function fetchCardsByCategory(category) {
    try {
        const { data, error } = await supabase
            .from('cards')
            .select('id, title, content, result, explanation, easy-explanation') // Include 'explanation'
            .eq('category', category);

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error fetching cards by category:', error);
        return [];
    }
}

export async function fetchCardById(id) {
    try {
        const { data, error } = await supabase
            .from('cards')
            .select('id, title, content, result, explanation') // Include 'explanation'
            .eq('id', id);

        if (error) throw error;

        return data && data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('Error fetching card by ID:', error);
        return null;
    }
}