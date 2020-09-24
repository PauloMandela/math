from django.contrib import admin

from .models import (
    MediaLib,
    Category,
    Article,
    Question,
    Tests,
    Profile)


class CategoryListAdmin(admin.ModelAdmin):

    list_display = ('cat_name', 'cat_description', 'get_parent_cat')

    def get_parent_cat(self, obj):

        cat_name = ""
        if obj.fk_parent:
            cat_name = obj.fk_parent.cat_name

        return cat_name

    get_parent_cat.short_description = 'Parent Category'

    def change_view(self, request, object_id, form_url='', extra_context=None):
        # Get/keep editing category's id
        self.object_id = object_id

        return super(CategoryListAdmin, self).change_view(
            request, object_id, form_url, extra_context=extra_context,
        )

    def formfield_for_foreignkey(self, db_field, request, **kwargs):

        # Check if self has property 'object_id'
        if hasattr(self, 'object_id'):
            # Check if current field is 'fk_parent'
            if db_field.name == "fk_parent":
                kwargs["queryset"] = Category.objects.exclude(pk=self.object_id)

        return super().formfield_for_foreignkey(db_field, request, **kwargs)


# Register models to admin panel
admin.site.register(MediaLib)
admin.site.register(Category, CategoryListAdmin)
admin.site.register(Article)
admin.site.register(Question)
admin.site.register(Tests)
admin.site.register(Profile)