
"use client";

import { useState } from 'react';
import { PAO_DATABASE, PAOEntry } from '@/lib/pao-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  icons, 
  Edit2, 
  Save, 
  X, 
  Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useFirestore, 
  useUser, 
  useCollection, 
  useMemoFirebase 
} from '@/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PAOTable() {
  const [search, setSearch] = useState("");
  const { firestore } = useFirestore();
  const { user } = useUser();
  
  // State for Editing
  const [editingEntry, setEditingEntry] = useState<PAOEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch custom entries from Firestore
  const customEntriesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'customPaoEntries');
  }, [firestore, user]);

  const { data: customData, isLoading: isCustomLoading } = useCollection<PAOEntry>(customEntriesQuery);

  // Merge static data with custom data from Firestore
  const mergedData = PAO_DATABASE.map(staticEntry => {
    const custom = customData?.find(c => c.number === staticEntry.number);
    return custom ? { ...staticEntry, ...custom } : staticEntry;
  });

  const filteredData = mergedData.filter(entry => 
    entry.number.includes(search) ||
    entry.person.toLowerCase().includes(search.toLowerCase()) ||
    entry.action.toLowerCase().includes(search.toLowerCase()) ||
    entry.object.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (entry: PAOEntry) => {
    setEditingEntry({ ...entry });
  };

  const handleSave = () => {
    if (!editingEntry || !firestore || !user) return;
    setIsSaving(true);

    const docRef = doc(firestore, 'users', user.uid, 'customPaoEntries', editingEntry.number);
    
    // Non-blocking update pattern
    setDoc(docRef, {
      ...editingEntry,
      id: editingEntry.number, // Ensure ID matches for security rules
      userId: user.uid,
      updatedAt: new Date().toISOString()
    }, { merge: true })
      .then(() => {
        setEditingEntry(null);
        setIsSaving(false);
      })
      .catch(async (error) => {
        setIsSaving(false);
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'write',
          requestResourceData: editingEntry,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <div className="space-y-6">
      <div className="relative max-w-sm mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari angka, orang, atau aksi..."
          className="pl-10 bg-muted/20 border-border/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="max-h-[600px] overflow-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-16 font-black text-primary">#</TableHead>
                <TableHead>Person</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Object</TableHead>
                <TableHead className="hidden md:table-cell">Etymology</TableHead>
                <TableHead className="w-12 text-center">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((entry) => {
                  const IconComponent = (icons as any)[entry.icon] || icons.Brain;
                  return (
                    <TableRow key={entry.number} className="hover:bg-primary/5 transition-colors group">
                      <TableCell className="font-black font-headline text-lg text-primary">
                        {entry.number}
                      </TableCell>
                      <TableCell className="font-bold">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          {entry.person}
                        </div>
                      </TableCell>
                      <TableCell className="text-secondary font-medium italic">
                        {entry.action}
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.object}
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground italic leading-tight hidden md:table-cell max-w-xs">
                        {entry.etymology}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 text-muted-foreground hover:text-primary"
                          onClick={() => handleEditClick(entry)}
                          disabled={!user}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Data tidak ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <DialogContent className="sm:max-w-[425px] bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-headline text-primary">
              Edit PAO {editingEntry?.number}
            </DialogTitle>
          </DialogHeader>
          
          {editingEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="person" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Person</Label>
                <Input 
                  id="person" 
                  value={editingEntry.person} 
                  onChange={(e) => setEditingEntry({...editingEntry, person: e.target.value})}
                  className="bg-muted/20 border-border/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="action" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Action</Label>
                <Input 
                  id="action" 
                  value={editingEntry.action} 
                  onChange={(e) => setEditingEntry({...editingEntry, action: e.target.value})}
                  className="bg-muted/20 border-border/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="object" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Object</Label>
                <Input 
                  id="object" 
                  value={editingEntry.object} 
                  onChange={(e) => setEditingEntry({...editingEntry, object: e.target.value})}
                  className="bg-muted/20 border-border/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="etymology" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Etymology</Label>
                <Textarea 
                  id="etymology" 
                  value={editingEntry.etymology} 
                  onChange={(e) => setEditingEntry({...editingEntry, etymology: e.target.value})}
                  className="bg-muted/20 border-border/50 resize-none h-24"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setEditingEntry(null)} disabled={isSaving} className="flex-1">
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="flex-1 gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!user && (
        <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest animate-pulse">
          Silakan login untuk menyimpan kustomisasi PAO Anda.
        </p>
      )}
    </div>
  );
}
