from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0002_menuitem_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='menuitem',
            name='is_available',
            field=models.BooleanField(default=True),
        ),
    ]