import csv

f = open(r'energy_consumption_2012_gr_(edited).csv',
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
        if i >= 1 and i <= 20:
            item.append("Northern Greece")
            if i >= 1 and i <= 5:
                item.append("Eastern Macedonia and Thraki")
            if i >= 6 and i <= 12:
                item.append("Central Macedonia")
            if i >= 13 and i <= 16:
                item.append("Western Macedonia")
            if i >= 17 and i <= 20:
                item.append("Thessalia")
            #item.append("#FF0000")
        if i >= 21 and i <= 41:
            item.append("Central Greece")
            if i >= 21 and i <= 24:
                item.append("Ipiros")
            if i >= 25 and i <= 28:
                item.append("Ionian Islands")
            if i >= 29 and i <= 31:
                item.append("Western Greece")
            if i >= 32 and i <= 36:
                item.append("Central Greece")
            if i >= 37 and i <= 41:
                item.append("Peloponnissos")
            #item.append("#00FF00")
        if i == 42:
            item.append("Attiki")
            if i == 42:
                item.append("Attiki")
            #item.append("#FFFF00")
        if i >= 43 and i <= 51:
            item.append("Aegean Islands-Kriti")
            if i >= 43 and i <= 45:
                item.append("Islands of Northern Egeo")
            if i >= 46 and i <= 47:
                item.append("Islands of Southern Egeo")
            if i >= 48 and i <= 51:
                item.append("Kriti")
            #item.append("#0000FF")
    new_data.append(item)

f = open(r'energy_consumption_2012_gr.csv',
         'w', encoding='UTF-8')
csv.writer(f).writerows(new_data)
f.close()
