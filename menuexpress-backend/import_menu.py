import os
import sqlite3
from pathlib import Path

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

os_path = Path(__file__).resolve().parent
django.setup()

from menu.models import MenuItem

backup_path = os_path / "db.sqlite3.backup"

connection = sqlite3.connect(backup_path)
connection.row_factory = sqlite3.Row

rows = connection.execute(
    """
    SELECT name, description, category, price, image
    FROM menu_menuitem
    ORDER BY id
    """
).fetchall()

connection.close()

if MenuItem.objects.count() > 0:
    raise RuntimeError(
        "MongoDB already contains menu items. Import cancelled to avoid duplicates."
    )

for row in rows:
    MenuItem.objects.create(
        name=row["name"],
        description=row["description"],
        category=row["category"],
        price=row["price"],
        image=row["image"],
    )

print(f"Imported {len(rows)} menu items into MongoDB.")
print(f"MongoDB menu item count: {MenuItem.objects.count()}")
