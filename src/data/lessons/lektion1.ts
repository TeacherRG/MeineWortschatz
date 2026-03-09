import { WordSet } from '../../types';

export const lektion1: WordSet = {
  id: 'unit-1-urlaub',
  title: 'Lektion 1: Urlaub & Reisen',
  description: 'Urlaubsformen, Planung, Natur und Aktivitäten',
  words: [
    // Urlaubsformen
    { id: '1', german: 'der Winterurlaub, -e', translation: 'зимний отпуск', category: 'Urlaubsformen', example: 'Wir machen dieses Jahr Winterurlaub in den Alpen.' },
    { id: '2', german: 'das Skigebiet, -e', translation: 'горнолыжный курорт', category: 'Urlaubsformen', example: 'Das Skigebiet ist sehr groß und modern.' },
    { id: '3', german: 'der (Ski-)Lift, -e', translation: 'подъемник', category: 'Urlaubsformen', example: 'Wir müssen am Lift lange warten.' },
    { id: '4', german: 'der Strandurlaub, -e', translation: 'пляжный отдых', category: 'Urlaubsformen', example: 'Ich liebe Strandurlaub in Spanien.' },
    { id: '5', german: 'die Küste, -n', translation: 'побережье', category: 'Urlaubsformen', example: 'Die Küste ist hier sehr steil.' },
    { id: '6', german: 'der Sand', translation: 'песок', category: 'Urlaubsformen', example: 'Der Sand am Strand ist weiß und fein.' },
    { id: '7', german: 'die Strandpromenade, -n', translation: 'набережная', category: 'Urlaubsformen', example: 'Abends gehen wir auf der Strandpromenade spazieren.' },
    { id: '7b', german: 'der Urlaubsgruß, -¨e', translation: 'привет из отпуска', category: 'Urlaubsformen', example: 'Ich schreibe viele Urlaubsgrüße an meine Freunde.' },
    { id: '7c', german: 'der Empfang (Sg.)', translation: 'прием (сигнала)', category: 'Urlaubsformen', example: 'Das Handy hat keinen Empfang.' },
    { id: '7d', german: 'weg sein', translation: 'отсутствовать / быть далеко', category: 'Urlaubsformen', example: 'Die Stadt ist weit weg.' },
    
    // Urlaubsplanung
    { id: '8', german: 'der Zeitpunkt, -e', translation: 'момент / дата / срок', category: 'Urlaubsplanung', example: 'Das ist ein guter Zeitpunkt für eine Reise.' },
    { id: '9', german: 'der Terminkalender, -', translation: 'ежедневник', category: 'Urlaubsplanung', example: 'Mein Terminkalender ist diese Woche voll.' },
    { id: '10', german: 'rechtzeitig', translation: 'вовремя / в срок', category: 'Urlaubsplanung', example: 'Wir müssen rechtzeitig am Flughafen sein.' },
    { id: '11', german: 'gründlich', translation: 'основательно', category: 'Urlaubsplanung', example: 'Wir müssen die Reise gründlich planen.' },
    { id: '12', german: 'buchen', translation: 'заказывать / бронировать', category: 'Urlaubsplanung', example: 'Ich habe gestern den Flug gebucht.' },
    { id: '13', german: 'sich entschließen', translation: 'решаться', category: 'Urlaubsplanung', example: 'Wir haben uns entschlossen, nach Italien zu fahren.' },
    { id: '14', german: 'die Halbpension', translation: 'полупансион', category: 'Urlaubsplanung', example: 'Das Hotel bietet Halbpension an.' },
    { id: '14b', german: 'die Vollpension', translation: 'полный пансион', category: 'Urlaubsplanung', example: 'Vollpension ist im Urlaub sehr bequem.' },
    { id: '14c', german: 'höchstens', translation: 'максимум / самое большее', category: 'Urlaubsplanung', example: 'Die Fahrt dauert höchstens zwei Stunden.' },
    { id: '14d', german: 'enthalten sein', translation: 'быть включенным', category: 'Urlaubsplanung', example: 'Das Frühstück ist im Preis enthalten.' },
    { id: '14e', german: 'der Kompromiss, -e', translation: 'компромисс', category: 'Urlaubsplanung', example: 'Wir müssen einen Kompromiss finden.' },
    { id: '14f', german: 'meinetwegen', translation: 'ради меня / я не возражаю', category: 'Urlaubsplanung', example: 'Meinetwegen können wir auch zu Hause bleiben.' },
    { id: '14g', german: 'dabei sein', translation: 'участвовать / присутствовать', category: 'Urlaubsplanung', example: 'Dann ist für jeden etwas dabei.' },
    { id: '14h', german: 'der Einfall, -¨e', translation: 'идея / выдумка', category: 'Urlaubsplanung', example: 'Das ist ein guter Einfall.' },
    { id: '14i', german: 'einpacken', translation: 'упаковывать', category: 'Urlaubsplanung', example: 'Ich muss noch meinen Koffer einpacken.' },
    { id: '14j', german: 'auspacken', translation: 'распаковывать', category: 'Urlaubsplanung', example: 'Nach der Reise müssen wir auspacken.' },
    { id: '14k', german: 'der Mitarbeiter, -', translation: 'сотрудник', category: 'Urlaubsplanung', example: 'Der Mitarbeiter im Reisebüro war sehr nett.' },
    { id: '14l', german: 'die Unterkunft, -¨e', translation: 'жилье / размещение', category: 'Urlaubsplanung', example: 'Ich habe keine Lust, lange nach einer Unterkunft zu suchen.' },
    
    // Reisen
    { id: '15', german: 'das Urlaubsziel, -e', translation: 'цель поездки', category: 'Reisen', example: 'Was ist dein liebstes Urlaubsziel?' },
    { id: '16', german: 'die Entfernung, -en', translation: 'расстояние', category: 'Reisen', example: 'Die Entfernung zum Strand ist gering.' },
    { id: '17', german: 'die Fahrtzeit, -en', translation: 'время в пути', category: 'Reisen', example: 'Die Fahrtzeit beträgt drei Stunden.' },
    { id: '17b', german: 'gegen acht Uhr', translation: 'около восьми часов', category: 'Reisen', example: 'Wir kommen gegen acht Uhr an.' },
    { id: '17c', german: 'der Hauptbahnhof, -¨e', translation: 'главный вокзал', category: 'Reisen', example: 'Der Zug fährt vom Hauptbahnhof ab.' },
    { id: '18', german: 'der Kofferraum, -¨e', translation: 'багажник', category: 'Reisen', example: 'Leg die Taschen in den Kofferraum.' },
    { id: '19', german: 'die Schifffahrt, -en', translation: 'судоходство / прогулка на корабле', category: 'Reisen', example: 'Wir machen eine Schifffahrt auf dem Rhein.' },
    { id: '19b', german: 'das Boot, -e', translation: 'лодка', category: 'Reisen', example: 'Wir mieten ein Boot für den Nachmittag.' },
    
    // Natur
    { id: '20', german: 'die Alm, -en', translation: 'альпийский луг', category: 'Natur', example: 'Die Kühe grasen auf der Alm.' },
    { id: '21', german: 'das Gebirge, -', translation: 'горный хребет', category: 'Natur', example: 'Wir wandern gerne im Gebirge.' },
    { id: '22', german: 'die Wiese, -n', translation: 'луг', category: 'Natur', example: 'Auf der Wiese blühen viele Blumen.' },
    { id: '23', german: 'die Traube, -n', translation: 'гроздь (винограда)', category: 'Natur', example: 'Die Trauben sind dieses Jahr sehr süß.' },
    { id: '24', german: 'reif', translation: 'зрелый', category: 'Natur', example: 'Die Äpfel sind schon reif.' },
    { id: '25', german: 'die Einsamkeit', translation: 'одиночество / уединение', category: 'Natur', example: 'Ich genieße die Einsamkeit in den Bergen.' },
    { id: '25b', german: 'einsam', translation: 'одинокий', category: 'Natur', example: 'Auf der Alm ist es eher einsam.' },
    { id: '25c', german: 'das Insekt, -en', translation: 'насекомое', category: 'Natur', example: 'Im Sommer gibt es viele Insekten.' },
    { id: '25d', german: 'giftig', translation: 'ядовитый', category: 'Natur', example: 'Vorsicht, dieser Pilz ist giftig!' },
    
    // Aktivitäten & Stimmung
    { id: '26', german: 'das Abenteuer, -', translation: 'приключение', category: 'Aktivitäten', example: 'Wir wollen im Urlaub ein Abenteuer erleben.' },
    { id: '27', german: 'entspannend', translation: 'расслабляющий', category: 'Aktivitäten', example: 'Ein heißes Bad ist sehr entspannend.' },
    { id: '28', german: 'sich erholen', translation: 'отдыхать / восстанавливаться', category: 'Aktivitäten', example: 'Im Urlaub kann ich mich gut erholen.' },
    { id: '29', german: 'faulenzen', translation: 'бездельничать', category: 'Aktivitäten', example: 'Am Sonntag will ich nur faulenzen.' },
    { id: '29b', german: 'spazieren', translation: 'гулять', category: 'Aktivitäten', example: 'Wir gehen im Park spazieren.' },
    { id: '29c', german: 'der Pilz, -e', translation: 'гриб', category: 'Aktivitäten', example: 'Wir gehen im Wald Pilze sammeln.' },
    { id: '30', german: 'begeistert sein', translation: 'быть в восторге', category: 'Stimmung', example: 'Ich bin von der Aussicht begeistert.' },
    { id: '31', german: 'zufrieden sein', translation: 'быть довольным', category: 'Stimmung', example: 'Bist du mit deinem Hotel zufrieden?' },
    { id: '32', german: 'enttäuscht sein', translation: 'быть разочарованным', category: 'Stimmung', example: 'Er war vom Wetter enttäuscht.' },
    { id: '33', german: 'genervt sein', translation: 'быть раздраженным', category: 'Stimmung', example: 'Ich bin von dem Lärm genervt.' },
    { id: '34', german: 'verzweifelt sein', translation: 'быть в отчаянии', category: 'Stimmung', example: 'Sie war verzweifelt, weil sie ihren Pass verloren hatte.' },

    // Grammatik & Struktur
    { id: '35', german: 'eher', translation: 'скорее', category: 'Struktur', example: 'Auf der Alm ist es eher einsam.' },
    { id: '36', german: 'falls', translation: 'в случае если', category: 'Struktur', example: 'Falls ihr Lust habt, meldet euch.' },
    { id: '37', german: 'offenbar', translation: 'очевидно', category: 'Struktur', example: 'Offenbar hatten auch andere diese Idee.' },
    { id: '38', german: 'solche', translation: 'такие', category: 'Struktur', example: 'Wir kennen solche Listen.' },
    { id: '39', german: 'vorne liegen', translation: 'быть впереди', category: 'Struktur', example: 'Berlin liegt in dieser Liste ganz vorne.' },
    { id: '40', german: 'wieso', translation: 'почему', category: 'Struktur', example: 'Wieso fahren wir nicht an die Ostsee?' },
    { id: '41', german: 'da', translation: 'так как', category: 'Struktur', example: 'Da die Stadt sehr bekannt ist, gibt es viele Touristen.' },
    { id: '42', german: 'obwohl', translation: 'хотя', category: 'Struktur', example: 'Obwohl es geregnet hat, waren wir gut gelaunt.' },
    { id: '43', german: 'beinahe', translation: 'почти', category: 'Struktur', example: 'Ich war beinahe drei Monate auf der Alm.' },
  ]
};
