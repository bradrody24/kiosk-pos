import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { CategoryDialog } from '@/components/categories/category-dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Category {
  id: string;
  name: string;
  created_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch categories"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast({
        title: "Success",
        description: "Category deleted successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete category"
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleCreate = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: name,
          // Add any other required fields here
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error); // Add this for debugging
        throw error;
      }

      setCategories(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Category created successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create category"
      });
    }
  };

  const handleEdit = async (name: string) => {
    if (!editingCategory) return;

    try {
      const { error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', editingCategory.id);

      if (error) throw error;

      setCategories(prev => 
        prev.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, name } 
            : cat
        )
      );
      toast({
        title: "Success",
        description: "Category updated successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update category"
      });
    }
  };

  return (
    <PageLayout title="Categories">
      <div className="p-4 space-y-4">
        <Button 
          className="w-full h-9 text-sm"
          onClick={() => {
            setEditingCategory(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Category
        </Button>

        {loading ? (
          <div className="text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <Card key={category.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(category.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setEditingCategory(category);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => setDeleteId(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <CategoryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={editingCategory ? handleEdit : handleCreate}
          title={editingCategory ? 'Edit Category' : 'New Category'}
          defaultValue={editingCategory?.name}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the category.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
} 