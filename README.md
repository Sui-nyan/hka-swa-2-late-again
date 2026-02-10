# Laborbericht

## 1. Einleitung

### Motivation
In Zeiten, in denen bewusstes Konsumieren und nachhaltiges Reisen aufgrund des Klimawandels immer relevanter werden, steigt auch die Popularität von „Slow Travel” und grünem Reisen gegenüber kurzen und CO2-intensiven Verkehrsmitteln. Nachhaltiges Reisen kann durch Zug-, Busfahren oder Carpooling gewährleistet werden.
In diesem Projekt befassen wir uns mit der Deutschen Bahn. Die Deutsche Bahn ist leider nicht für ihre Pünktlichkeit und Zuverlässigkeit bekannt, doch es gibt wenige Alternativen, wenn man eine Zugreise planen möchte.
Vor diesem Hintergrund soll das folgende Projekt bei der Planung von Zugreisen innerhalb Deutschlands helfen. In einer Webanwendung sollen statistische Informationen über die Pünktlichkeit von Zügen an verschiedenen Stationen der Deutschen Bahn dargestellt werden. Diese Informationen sollen Reisenden dabei helfen, datengetriebene Entscheidungen für ihre nächste Zugreise zu treffen.
Zur Vertiefung: Dieses Projekt zielt darauf ab, Nutzerinnen und Nutzern fundierte Entscheidungsgrundlagen zu liefern, indem es historische Pünktlichkeitsdaten der Deutschen Bahn systematisch sammelt, aufbereitet und visualisiert. Neben der praktischen Reiseplanung soll die Anwendung Trends und Schwachstellen im Netz sichtbar machen, um sowohl Pendlern als auch Forschenden und Verkehrsplaner:innen Erkenntnisse über wiederkehrende Verzögerungsmuster zu bieten. Ein weiterer Motivationsaspekt ist die Förderung nachhaltiger Mobilitätsentscheidungen: verlässliche Informationen über Zugqualität stärken das Vertrauen in den öffentlichen Verkehr.

### Zielsetzung
Das Web-Projekt soll aus zwei Seiten bestehen. Eine Seite zeigt eine Übersicht der Deutschlandkarte mit ausgewählten Stationen der Deutschen Bahn. Je nach relativer Anzahl verspäteter Züge wird die Station entsprechend rot eingefärbt. 
Auf der zweiten Seite kann der Nutzer eine konkrete Zug-Verbindung abonnieren. Sobald diese Verbindung festgelegt wird werden alle möglichen Verbindungen zwischen diesen beiden Stationen angezeigt und Statisken zu dieser Verbindung ausgewertet.

**Konkrete Zielsetzungen**
- Bereitstellung einer interaktiven Netzwerk-Übersicht, die Bahnhöfe nach Verspätungsquote visualisiert und dynamisch filterbar ist (Verkehrstyp, Ankunft/Abfahrt, Zeitraum).
- Implementierung eines Abonnementsystems für Verbindungen mit Detailauswertungen (Umstiege, Alternativrouten, historische Pünktlichkeitsstatistiken).
- Aufbau einer zuverlässigen Daten-Pipeline (API-Abfrage, Persistenz in PostgreSQL, Aggregation, Caching) für reproduzierbare Analysen.
- Export- und Benachrichtigungsfunktionen (CSV/JSON-Export, Alerts bei signifikanten Änderungen oder langen Verspätungen).
- Nicht-funktionale Ziele: skalierbare Architektur, akzeptable Antwortzeiten für Visualisierungen und Einhaltung datenschutzrechtlicher Vorgaben.

#### Weitere Requirements zum Vorgehen und Technologieauswahl

**Nicht-Funktionale Requirements**

Bei der Technologieauswahl sind wir als lernende Studenten relativ flexibel - dennoch gibt es einige Leitfaden nach denen wir Entscheiden. Die verwendete Technologie sollte

- **eine etablierete Lösung für Software sein.** Wir möchten Technologien anlernen welche guten Praktiken beibringen und/oder wertvolle Erfahrung für den weiteren Karrierepfad bieten. Solch eine Technologie bietet noch weitere Vorteile die wir wahrnehmen möchten.
  - **gut dokumentiert sein**.
- **keines unserer Spezialisierungen entsprechen.** Da dies eine wertvolle Lernerfahrung ist, möchten wir diese Gelegenheit nutzen uns in Technologien zu vertiefen von denen wir bisher kein klares Bild haben.
- **in irgendeiner Hinsicht vertraut und accessible sein.** Um das Einarbeiten zu verkürzen, und auch den zeitlichen Rahmen einhalten zu können, sollten wir keine Technologie die komplett fremd unserer Kapazitäten ist. Dies bedeutet z.B. keine spezialisierte Hardware, keine komplett fremde Programmiersprache. Die Zeit möchten wir darin investieren architektonische Konzepte zu testen, anstatt mit dem Werkzeug zu kämpfen.
- **keine zusätzliche Kosten verursachen.** Wir haben uns persönlich festgelegt keine Technologien zu nutzen die Kosten mit sich tragen.

Aus den oben genannten Requirements verfeinern wir einige zu messbaren Requirements.

- Kostenlos
- Bekannte Programmiersprache

## 2. Grundlagen
### Detaillierte Problemstellung

#### **Technologieauswahl**

Dieses Web-Projekt verwendet Next.js als Framework für sowohl das Frontend als auch das Backend. Da Next.js eine Fullstack Anwendung vereinfacht dies die Notwendigkeit sowohl ein Frontend- als auch ein Backend-Repository aufzusetzen. Zusätzlich ist Next.js ein React Framework. Da React eine aktuell sehr beliebt im Kontext des Webdevelompent ist, erachten wir es als sinnvoll Erfahrungen mit diesem Framework zu sammeln.

Für die Umsetzung des Frontends wurden die Frontend Bibliotheken [HeroUI](https://www.heroui.com/) und [d3.js](https://d3js.org/) genutzt. HeroUI bietet eine große Auswahl an Frontend Komponenten an und verschnellert so die Entwicklung im Frontend ohne zusätzliche Koten, da es eine Open-Source Bibliothek ist. D3.js ist mit 112 Tausend Sternen auf Github einer der größten und beliebtesten Open-Source Bibliotheken für die Daten-Visualisierung im Web.

Die Daten, die für das Projekt werden von der [Deutschen Bahn API](https://developers.deutschebahn.com/db-api-marketplace/apis/frontpage) zugestellt. Das Speichern der Daten erfolgt über Postgresql. Wir haben eine relationale Datenbank gewählt, da

Da Verspätungen von Bahnen gelöscht werden, sobald Sie von der jeweiligen Station abgefahren sind, war es hier notwendig, dass wir die abgefragten Daten der API in eine eigene Datenbank speichern. So gewährleisten wir, dass auch Verspätungen aus den vorherigen Tagen für den Nutzer verfügbar sind.

Das Abfragen und Speichern von Daten der Deutschen Bahn API erfolgt seperat über Python. Python bietet, als eine Programmiersprache die oft im Kontext von Datenverarbeitung genutzt wird, eine breites Angebot für die Daten-Verarbeitung und -Aggregation.

Für die generelle Orchestrierung nutzen wir Docker - spezifischer Docker Compose. Die Container-isierung als Grundvoraussetzung bietet eine grobe, aber strikte Trennung von Datenbank, Datenaggregator und dem User-gewanndten Webservice. Dies soll unnötige Abhängigkeiten mindern und vereinfacht auch die spätere weitere Modularisierung, falls notwendig.


#### **Use Cases**
Das System verfolgt zwei zentrale Use Cases: Zum einen eine interaktive Heatmap, die Bahnhöfe nach ihrer relativen Verspätungsquote farblich darstellt und sich dynamisch nach Verkehrstyp (Nah-/Fernverkehr/alle), Ankunft/Abfahrt und Datum filtern lässt, um schnell problematische Abschnitte im Netz zu identifizieren.
Zum anderen eine Verbindungsauswertung, die es Nutzern ermöglicht, konkrete Reisen (inkl. Umstiegen) zu abonnieren und für diese historische Pünktlichkeitsstatistiken, zeitliche Muster sowie alternative Routen bereitzustellen – nützlich zur Reiseplanung, Abschätzung von Ausfallrisiken und zur Vorbereitung von Entschädigungsanträgen. Beide Funktionen bieten aggregierte Kennzahlen, Visualisierungen und Exportmöglichkeiten sowie die Option, Benachrichtigungen bei relevanten Änderungen zu erhalten, sodass Pendler, Gelegenheitsreisende und Forschende datenbasierte Entscheidungen treffen können.

#### User Journey
1. Student möchte in der vorlesungsfreien Zeit nach Hause reisen.
2. Student hat kein Geld für ein ICE-Ticket für eine direkte Verbindung und schaut sich Alternativen im Nahverkehr an
3. Student schaut sich die Statistiken der letzten zwei Wochen für die vorgenommene Strecke an
4. Student sieht erkennt, dass über Stadt A häufiger Bahnen verspätet sind als über Stadt B und die Bahnen dazu tendieren am wochentag pünktlicher anzukommen als am Wochenende. 
5. Student entscheidet sich für die Reise über Stadt B am nächsten Dienstag

#### **Muss-/Kann-Kriterien**

#### Muss
- Daten Aggregation, Caching von Daten aus der Deutschen Bahn API
- Interaktive Karte
    - Anklickbare Stationen mit Statistiken über die 
- Visualisierung von Verspätungen im Netz der Deutschen Bahn
    - Timeline über die letzten X Tage

#### Kann
- Erweiterung auf europäisches Bahnnetz
- Prognose für verspätete Züge anhand der vergangenen Verspätungen
    - Einfaches ML-Modell
- Merken von mehreren Reisenrouten
    - Festes Start und Endziel wird vom User festgelegt
    - Statistiken über die Verspätungen der Züge auf der Reiseroute
    - Merken von Verbindungen mit einer Verspätung von über 60 Minuten
        - Formular zum Ausfüllen, dass direkt gedruckt und an die DB gesendet werden kann

## 3. Umsetzung / Implementierung

### Projekt-Architektur
![Projekt-Architektur](image.png)

### Was umgesetzt wurde

Aus Sicht des Nutzers: Webseite, die Deutschlandkarte zeigt, mit ausgewählten Bahnhöfen. Die Bahnhöfe sind farblich markiert entsprechend ihrer "Pünktlichkeitsquote". Nutzer kann pro Bahnhof genauer einsehen wie die Verteilung der Verspätungen und Pünktlichkeiten sind.

**Technisch.** Es wurde entwickelt: ein Backend mit Frontend, Datenbank und ein Container mit dem simplen Datenaggregator als Prozess.
Das Backend und Frontend sind keine getrennten Prozesse sondern laufen beide innerhalb von NextJS. Aus Entwicklersicht sind die Module jedoch klar getrennt als API Endpoints, welche bei Frontendanfrage mit verarbeiteten Daten antwortet.

**Frontend**. Der Frontend Code folgt dem Framework gegebenen "App Router" Struktur. Dabei werden die URL Pfade bestimmt durch die Ordnerstruktur.
Es hauptsächlich aus den Views "Map" und "Connection". "Map" zeigt hier die Deutschlandkarte und die Übersicht der Verspätungsquoten. "Connection" sollte eine spezifische Route zwischen zwei Bahnhöfen anzeigen und hierbei ausgewählt die Pünktlichkeitsdaten bezueglich dieser Journey anzeigen. Dieses Feature ist leider nur statisch mit Mockdaten umgesetzt, da uns die Journeydaten fehlen, und keine Möglichkeit bestand mit der kostenlosen Bahn-API eine bedeutungsvolle Menge an Daten in kurzen Zeit-Takt zu aggregieren.

**Backend/Endpoints**. Es wird lediglich ein Endpoint angeboten zum tatsächlichen Use Case (Pünktlichkeits-Statistik). Logisch ist das Backend geteilt in ein API Layer (den Endpoints), einem UseCase Layer und einem Persistence Layer in Form von "Repositories". In diesem Fall implementieren diese nur die nötigsten Read Operationen für die Datenbank da es keinen Bedarf für Schreiboperationen von Seiten des Frontends gab. Das Persistence Layer arbeitet mit Prisma ORM und deckt damit die Typisierung und die Aktuell-haltung der Datenmodelle. Zwischen der Persistenz und der API haben wir ein weiteren Layer abstrahiert, in dem die Rohdaten der Datenbank verarbeitet werden. (Hier: Sammeln des Fahrplans und dessen Abweichung). Das API Layer ist lediglich zuständig dafür die Informationen aus dem GET Requests auszulesen, diese mit der Use Case Implementierung weiterzugeben, und letztlich die Antwort als JSON zurückzugeben. **Der Aggregator ist als einzelner Prozess in einem seperaten Container gestaltet. Die Kommunikation des Aggregators erfolgt direkt mit der Datenbank über eine Python ORM.


### Pitfalls
- Herausforderungen mit der Deutschen Bahn API
Dokumentation der API ist teilweise veraltet, lückenhaft oder sogar falsch. 
API liefert sehr viel Informationen mit, die irrelevant für den Use Case des Projekts  

- Aktualisierung von Änderungen im Fahrplan

- Skalierbarkeit von Systemen (Daten, Struktur)

- Zeitmanagement
Umsetzung aller Muss-Kriterien angesichts der Herausforderungen mit der Deutschen Bahn API und den zeitlichen Rahmen des Labors waren unrealistisch.




## 4. Fazit
In den ersten Wochen erschien uns das Projekt durchaus machbar für zwei Personen. Doch während der Erarbeitung mussten wir feststellen, dass uns einige Herausforderungen begegneten, die wir anfangs nicht wahrgenommen hatten.
Die vollständige Umsetzung all unserer Muss-Kriterien stellte sich für zwei Personen im Rahmen von 50 bis 60 Stunden pro Person als schwierig heraus. Wir waren gezwungen, Prioritäten zu setzen und Abstriche zu machen, damit wir die Deadlines einhalten können.
Es war insgesamt eine interessante Erfahrung, zu experimentieren, wie große Mengen an Daten im Webbrowser darstellbar gemacht werden können, und wir lernten dadurch auch die Grenzen unserer Browser kennen, als diese während der Entwicklung teilweise feststeckten und abstürzten.