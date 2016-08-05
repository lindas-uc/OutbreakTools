# Users

## Ziel der Applikation
Die Applikation soll einen Use-Case zur sinnvollen Verwendung von Linked Data beim Bund demonstrieren. Ziel ist es, die Ausbreitung von Tierseuchen visuell darstellen zu können und ein mögliches Tool zur Unterstützung der effizienten Bekämpfung von Tierseuchen zu liefern. 
Als Grundlage dienen die Tierbewegungsdaten,….

## Funktionsweise
In der Applikation wurden zwei verschiedenen Algorithmen implementiert. Das Forward- und das Backward-tracing. Das Forward-tracing beruht auf der Idee, die mögliche Ausbreitung der Seuche von einem infizierten Ursprungsbetrieb aus zu visualisieren. 
 
Der Algorithmus gibt alle Betriebe zurück, welche in der Kontaktkette nach dem Ursprungsbetrieb folgen.
Das Backward-tracing untersucht, welchen Ursprung eine beobachtete Tierseuche haben könnte. Dazu werden eine oder mehrere Betriebe als Startbetriebe angegeben, von welchen aus im Netz rückwärts gesucht wird.
 
Der Algorithmus gibt alle Betriebe zurück, welche in der Kontaktkette zwischen dem möglichen gemeinsamen Ursprung und den infizierten Betrieben liegen. 
## Benützung
**Eingabemaske**: Unter ID Betrieb werden die IDs von den Betrieben eingegeben, von denen aus gesucht werden soll. Beim Forward-tracing kann nur eine ID eingegeben werden, beim Backward-tracing sind mehrere möglich. 

Der Zeitraum schränkt die Suche ein. Der Algorithmus betrachtet nur Bewegungen, welche zwischen dem Startzeitpunkt und dem Endzeitpunkt liegen. Alternativ kann mit Hilfe des Feldes Anzahl Tage und klicken des Refresh Buttons ein gewünschter Zeitraum vom Endzeitpunkt subtrahiert und als Startzeitpunkt gewählt werden.

Mit Hilfe der Checkboxen kann zwischen dem Forward-tracing und dem Backward-tracing gewählt werden. 

Das Dropdown Menu „Beispiel auswählen“ bietet verschiedene Beispielabfragen zum Forward- und zum Backward-tracing.  


# Developers

## Technologien

## Code-Aufbau

## Code-Ablauf
