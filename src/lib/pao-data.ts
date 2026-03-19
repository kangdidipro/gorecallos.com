
export interface PAOEntry {
  number: string;
  person: string;
  action: string;
  object: string;
  etymology: string;
}

// Generating 100 entries with some provided samples
export const PAO_DATABASE: PAOEntry[] = Array.from({ length: 100 }, (_, i) => {
  const num = i.toString().padStart(2, '0');
  
  // Specific data provided by user
  if (num === '42') {
    return {
      number: '42',
      person: 'Tentara Jepang',
      action: 'Mendarat',
      object: 'Sepeda Onthel',
      etymology: '42 diasosiasikan dengan era penjajahan di beberapa wilayah lokal Indonesia.'
    };
  }
  if (num === '99') {
    return {
      number: '99',
      person: 'BJ Habibie',
      action: 'Melepas',
      object: 'Pesawat Kertas',
      etymology: 'BJ Habibie dikenal dengan kecintaan dan kontribusinya pada dirgantara.'
    };
  }

  // Placeholder logic for others as requested
  // In a real app, this would be fully populated from the PDF.
  const placeholders: Record<string, string[]> = {
    '0': ['Einstein', 'Menulis', 'Papan Tulis'],
    '1': ['Soekarno', 'Berorasi', 'Mikrofon'],
    '2': ['Gajah Mada', 'Bersumpah', 'Keris'],
    '3': ['RA Kartini', 'Membaca', 'Buku'],
    '4': ['Lionel Messi', 'Menendang', 'Bola'],
    '5': ['Iron Man', 'Terbang', 'Reaktor'],
    '6': ['Chef Juna', 'Memotong', 'Pisau Tajam'],
    '7': ['James Bond', 'Menembak', 'Pistol Silencer'],
    '8': ['Spider-Man', 'Memanjat', 'Jaring'],
    '9': ['Michael Jordan', 'Melompat', 'Ring Basket'],
  };

  const firstDigit = num[0];
  const secondDigit = num[1];
  
  const basePerson = placeholders[firstDigit]?.[0] || 'Tokoh Misterius';
  const baseAction = placeholders[secondDigit]?.[1] || 'Melakukan Aksi';
  const baseObject = placeholders[secondDigit]?.[2] || 'Benda Unik';

  return {
    number: num,
    person: `${basePerson} ${num}`,
    action: baseAction,
    object: baseObject,
    etymology: `Kaitan etimologi untuk angka ${num} akan disesuaikan dengan tabel lampiran.`
  };
});
