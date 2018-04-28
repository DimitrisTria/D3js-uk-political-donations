import csv

f = open(r'_energy_consumption_2012_gr.csv',
         'r', encoding='UTF-8')
data = [item for item in csv.reader(f)]
f.close()

new_data = []
for i, item in enumerate(data):
    if i == 0:
        item.append("geographic_area")
        item.append("region")
        item.append("color")
    else:
        if i >= 1 and i <= 21:
            item.append("Northern Greece")
            if i >= 1 and i <= 5:
                item.append("Eastern Macedonia and Thraki")
            if i >= 6 and i <= 12:
                item.append("Central Macedonia")
            if i >= 13 and i <= 16:
                item.append("Western Macedonia")
            if i >= 17 and i <= 21:
                item.append("Thessalia")
            item.append("#FF0000")
        if i >= 22 and i <= 45:
            item.append("Central Greece")
            if i >= 22 and i <= 26:
                item.append("Ipiros")
            if i >= 27 and i <= 30:
                item.append("Ionian Islands")
            if i >= 31 and i <= 33:
                item.append("Western Greece")
            if i >= 34 and i <= 39:
                item.append("Central Greece")
            if i >= 40 and i <= 45:
                item.append("Peloponnissos")
            item.append("#00FF00")
        if i == 46:
            item.append("Attiki")
            if i >= 46:
                item.append("Attiki")
            item.append("#CACACA")
        if i >= 47 and i <= 57:
            item.append("Aegean Islands-Kriti")
            if i >= 47 and i <= 49:
                item.append("Islands of Northern Egeo")
            if i >= 50 and i <= 51:
                item.append("Islands of Southern Egeo")
            if i >= 52 and i <= 56:
                item.append("Kriti")
            item.append("#0000FF")
    new_data.append(item)

f = open(r'energy_consumption_2012_gr.csv',
         'w', encoding='UTF-8')
csv.writer(f).writerows(new_data)
f.close()
