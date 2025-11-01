# Pflichtenheft

## Problemstellung

> **Die Reisendenpünktlichkeit im Fernverkehr lag im September bei 61,9 Prozent (September 2024: 67,9 Prozent).**
> 
> 
> [Quelle](https://www.deutschebahn.com/de/konzern/konzernprofil/zahlen_fakten/puenktlichkeitswerte-6878476)
> 

Trotz Stereotypen gegenüber deutscher Pünktlichkeit, glänzt die Deutsche Bahn selten mit ihren Statistiken. Hieraus möchten wir eine Applikation entwickeln, die Reisenden helfen können zu identifizieren, an welchen Tagen eine Reise mit der Deutschen Bahn lieber nicht vorgenommen werden sollte, in dem wir durch Visualisierungen eventuelle Muster darstellen möchten.

Zwar hat die Bahn Auskünfte über die Verspätungen ihrer einzelnen Fahrten - in der Realität geschehen Reisen jedoch oft mit Umstiege. Besonders ferne Reiseziele die nicht durch Fernverkehr abgedeckt, bedingen Umstiege zwischen Nahverkehr Zügen, wodurch auch kürzere Umstiege durch kleine Verspätungen zu einem größeren Verzug führen können. Dies würde zu einer effektiv niedrigen Reisendenpünktlichkeit führen, trotz gelungener Betriebspünktlichkeit.

## Technologieauswahl

(mit Begründung)

Die Menge der abgefragten Daten ist relativ groß und korreliert zeitlich wenig mit der Nachfrage der Informationen. Dadurch müssen die Daten zunächst von APIs aggregiert werden, um diese dann dem Nutzer anzubieten. ⇒ Konstellation von Server + [Client.](http://Client.Es) Es handelt sich primär um ein reines Informationsangebot ohne Echtzeit-Bedarf. Aus diesem Grund entscheiden wir uns für eine Webseitenanbindung, um der Service auf den Service auf möglichst vielen Geräten zu ermöglichen.

Für die Umsetzung wird Next.js genutzt. Dieses Framework ermöglicht die Implementation einer Fullstack Webanwendung.

Als Programmiersprache wird TypeScript verwendet. TypeScript ist eine auf JavaScript basierende Programmiersprache, die stark typisiert ist.

Für das Backend wird eine relationale Datenbank benutzt wie zB Postgresql um die Daten der Deutschen Bahn zunächst zu aggregieren und später abzurufen. Die Weiterverarbeitung wird vom Backend direkt ausgeführt oder angestossen und in seperaten Prozessen mit zB Python Skripten asynchron bearbeitet.

## Use Case

Heatmap von Stationen entsprechend ihrer Verspätungsquote.

- Gefiltert nach
    - Nahverkehr/Fernverkehr/alle/…
    - Ankunft/Abfahrt
    - Tag
    - Uhrzeit
- Pünktlichkeit einer “Reise” (Fahrten mit einer oder mehreren Umstiegen)
    - historisch auf Uhrzeit, Tag zur Erkennung von möglichen Mustern
    - → Informationen zur Vereinfachung für den Antrag auf Rückerstattung
    - → Einschätzung alternativen Routen

## MVP

### Muss

- Daten Aggregation, Caching
- Bedienung durch Frontend
- Interaktive Karte
    - Heatmap mit verspäteten Ankünften, Abfahrten an Stationen
- Visualisierung von Verspätungen im Netz der Deutschen Bahn
    - Timeline über die letzten X Tage
- Informationen über Züge mit Verspätung > 60 Min

### Kann

- Erweiterung auf europäisches Bahnnetz
- Prognose für verspätete Züge
- Merken von mehreren Reisen
    - Festes Start und Endziel
- Formular für Einreichen von Verspätungen direkt an DB weitergeleitet

(Muss-/Kann-Kriterien)

### Trivia - Wussten Sie…?

Fahrgastrechte Deutschlandticket

Wenn ein Reise im Nahverkehr eine Ankunftsverspätung von >60 Minuten hat bekommt man…

- 1,5€ pro Verspätung
- ab 4€ eine Auszahlung Entschädigung für Verspätung
- maximal 25% seines Tickets erstattet
- z.B. Umstiegszeit von 15 Minuten - jedoch war der erste Zug 20 Minuten zu spät, und der nächste Anschluss kommt erst in 45 Minuten ⇒ Eine Stunde spätere Ankunft
