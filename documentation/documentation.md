# Users

## Ziel der Applikation
Die Applikation soll einen Use-Case zur sinnvollen Verwendung von Linked Data beim Bund demonstrieren. Ziel ist es, die Ausbreitung von Tierseuchen visuell darstellen zu können und ein mögliches Tool zur Unterstützung der effizienten Bekämpfung von Tierseuchen zu liefern. 
Als Grundlage dienen die Tierbewegungsdaten,….

## Funktionsweise
In der Applikation wurden zwei verschiedenen Algorithmen implementiert. Das Forward- und das Backward-tracing. Das Forward-tracing beruht auf der Idee, die mögliche Ausbreitung der Seuche von einem infizierten Ursprungsbetrieb aus zu visualisieren. 
![Forward-tracing](forward-tracing.PNG)
Der Algorithmus gibt alle Betriebe zurück, welche in der Kontaktkette nach dem Ursprungsbetrieb folgen.
Das Backward-tracing untersucht, welchen Ursprung eine beobachtete Tierseuche haben könnte. Dazu werden eine oder mehrere Betriebe als Startbetriebe angegeben, von welchen aus im Netz rückwärts gesucht wird.
![Backward-tracing](backward-tracing.PNG)
Der Algorithmus gibt alle Betriebe zurück, welche in der Kontaktkette zwischen dem möglichen gemeinsamen Ursprung und den infizierten Betrieben liegen. 
## Benützung
*Eingabemaske*: Unter ID Betrieb werden die IDs von den Betrieben eingegeben, welche als Startbetriebe des Forward- oder Backward-tracing dienen sollen. Beim Forward-tracing kann nur eine ID eingegeben werden, beim Backward-tracing sind mehrere möglich. 
Der Zeitraum schränkt die Suche ein. Die Algorithmen betrachten nur Bewegungen, welche zwischen dem Startzeitpunkt und dem Endzeitpunkt liegen. Alternativ kann mit Hilfe des Feldes Anzahl Tage und klicken des Refresh Buttons ein gewünschter Zeitraum vom Endzeitpunkt subtrahiert und als Startzeitpunkt gewählt werden.
Mit Hilfe der Checkboxen kann zwischen dem Forward-tracing und dem Backward-tracing gewählt werden. 
Das Dropdown Menu „Beispiel auswählen“ bietet verschiedene Beispielabfragen zum Forward- oder Backward-tracing.  
# Developers
## Technologien
Als **Hauptframework** für das Front End wurde [Angular.js]( https://angularjs.org/) verwendet. Die Angular Applikation mit dem Namen „lindasMailCtrl“ bildet das Zentrum. Der Controller ist in lindasMailCtrl.js ausgelagert. Alle dynamischen Elemente der Applikation welche nicht durch D3.js erstellt und animiert werden, wurden an die Angular Variablen zu Beginn von lindasMailCtrl.js gebunden. Ein Teil der Variablen wird in der Funktion $scope.initializeScope() bestimmt, da diese bei jeder neuen Abfrage auf den Ursprungswert zurückgesetzt werden müssen. 

Das **Design** wurde mehrheitlich mit [Bootstrap v3]( http://getbootstrap.com/) erstellt. Als Grundlage diente das Bootstrap Template [Business-casual]( https://startbootstrap.com/template-overviews/business-casual/). Die Struktur in Index.html wurde aber sehr stark abgeändert, sodass vom ursprünglichen Aufbau fast ausschliesslich die Klasse „box“ übrigbleibt. Die Styles wurden ebenfalls stark abgeändert. In business-casual.css welches sich im Ordner CSS befindet, wurden einige Dinge gestrichen oder auskommentiert. Ein eigenes Stylesheet wurde hinzugefügt, welches sich im gleichen Ordner befindet. Das Design wurde an das [CD Bund]( https://www.bk.admin.ch/themen/02268/index.html?lang=de) angepasst, jedoch keine Codefragmente exakt kopiert. 

Das **Kartenmaterial** stammt vom [SwissTopo WMTS Dienst]( https://www.geo.admin.ch/de/geo-dienstleistungen/geodienste/darstellungsdienste-webmapping-webgis-anwendungen/web-map-tiling-services-wmts.html) und wurde mithilfe von [OpenLayers2]( http://openlayers.org/two/) eingebunden. Auf die [geo.admin API]( https://api3.geo.admin.ch/) und OpenLayers3 wurde bewusst verzichtet, da beide das SVG Element nicht mehr unterstützen, welches für die Verwendung von D3.js unentbehrlich ist. 

Für die **Visualisierung** wurde [D3.js]( https://d3js.org/) gewählt. Der ganze D3.js Code befindet sich im unter /js/mapService/d3Visualization und bildet mit „d3Vis“ einen eigenen Namespace. 

Die **Daten** werden direkt von SPARQL Endpoints abgefragt. ***…(ergänzen)...***
## Code-Aufbau
lindasMainCtrl.js und index.html sind die beiden zentralen Elemente des Codes. Drei weitere Angular Directives wurden eingebunden welche in den Ordnern ValidatorService und otherServicesAndDirectives zu finden sind. Daneben existieren zwei weitere Unterordner (dataService und mapService), welche aber normalen Javascript Code und keine Angular Services beinhalten. Die Codes werden von der Angular Applikation aufgerufen.  

Einige simple Datenmanipulationen wurden direkt im Angular Controller implementiert. Daneben beinhaltet der Ordner **dataService** alle komplexeren Codes, welche mit dem Verändern und Manipulieren sowie dem Speichern der Daten zu tun haben:
-	**dataInitialisator**: Der Namespace dataInitialisator ist zuständig für die initiale Datenabfrage. Mithilfe des javaConnectors bekommt er die Rohdaten und  teilt sie in move-Objekte auf. 
-	**javaConnector**: Anhand der Eingaben, welche in $scope gemacht wurden, startet der  javaConnector einen GET-Request an das Forward- oder Backward-tracing und retourniert die Antwort mittels Callback-function. 
-	**dataInitialisatorTestData**: Anstatt dass die SPARQL-Endpoints kontaktiert werden, kann mit Hilfe des dataInitialisatorTestData ein vordefiniertes JSON File geparst werden. In $scope kann zwischen dem dataInitialisator und dem dataInitialisatorTestData gewählt werden. 
-	**moveObject**: Der dataInitialisator wandelt die Daten in move-Objekte um, welche wiederum aus jeweils einem Start- und einem Ziel-businessObject besteht. 
-	**businessObject**: Repräsentiert einen Betrieb. Über die entsprechenden Objektfunktionen können die Attribute ergänzt werden (municipality, coordinates, businessType).
-	**idToURIConverter**: Konvertiert ID’s in URI’s und umgekehrt. 
-	**helperMethods**: Einige kleinere Methoden
-	**testData.json**: Kann verwendet werden um die SPARQL Abfrage zu umgehen (Offline testen). Wurde nicht an die finalen Änderungen angepasst und funktioniert darum nicht mehr.

Alles was mit der Visualisierung der Daten und Anzeigen der Karten zu tun hat, wurde im Ordner **mapService** implementiert:
-	**mapService**: Dient als Driver für die Initialisation der OpenLayers Karte und der D3 Visualisierung. 
-	**olMap**: Ist ein NameSpace für alle Funktionen, die die OpenLayers Karte betreffen. 
-	**WMTSLayers**: Speichert nur die Konfigurationen für die verschiedenen SwissTopo Karten. Wird verwendet, um die Karte zu initialisieren und diese zu wechseln.
-	**d3Visualization**: Alle Dinge, die mit D3.js visualisiert werden, geschehen hier. Mit Hilfe der Funktion drawVisualization wird die Visualisierung initial gezeichnet. Die Funktion update() passt die Visualisierung nach jeder dynamischen Änderung der Variablen (filterStartDateMilliseconds, filterEndDateMilliseconds, Settings,…) an. Die Änderungen werden jeweils von der Angular Funktion *$scope.$watchGroup(‚filterStartDateMilliseconds‘, ‚filterEndDateMilliseconds‘…) – lindasMailCtrl.js * erkannt und die update Funktion von d3Visualization aufgerufen.

## Code-Ablauf
Die User Eingaben im Inputfeld werden alle im lindasMainCtrl.js verarbeitet. Wenn auf den Button „absenden“ geklickt wird, wird die Funktion $scope.initializeVisualization() aufgerufen. Diese überprüft mithilfe des ValidatorServices die Eingaben. Falls alles korrekt ist, wird die Anfrage an den dataInitialisator weitergeleitet. Mit Hilfe des javaConnectors stellt dieser die Daten zusammen und parst sie in einen Array von moveObjects. Die businessObjects des moveArray erhalten über deren eigene Funktionen via SPARQL-Endpoint ihre Koordinaten, BusinessType und GemeindeURI. 
Sobald alle Daten komplett sind, wird der Array an den lindasMainCtrl.js zurückgegeben und in $scope als Variable „data“ gespeichert. Eine Kopie davon wird mit Hilfe der Variable „originalData“ erstellt. 
![The process of getting data](gettingData.PNG)
Sobald diese Aktionen abgeschlossen sind, ruft $scope.initializeVisualization() die Funktion map.initializeMap() in mapService.js auf. 
Die Funktion map.initializeMap() besteht grob aus zwei Blöcken. Sie startet die Funktionen zum Konfigurieren der OpenLayers Map und ruft die Funktionen zum Zeichnen der D3 Visualisierung auf. Der Namespace olMap beinhaltet alle Funktionen zum Konfigurieren der OpenLayers Map. Ausserdem zeichnet er die Buttons zum Ändern der Karte.
Der d3Vis Namespace ist das grösste der Files. Es besteht aus den Funktionen drawVisualization(), update(), reset() sowie einigen Hilfsmethoden und Funktionen zum Zeichnen des Sliders und Ermöglichen der Animation. Folgende Liste zeigt die Aufgabenverteilung zwischen den verschiedenen Funktionen:

**drawVisualization():** 
-	Zeichnen des SVG Elements
-	Ordnen der Daten (Startbetriebe sollen am Schluss gezeichnet werden)
-	Hinzufügen der g Elemente
-	Hinzufügen der Marker für die Pfeilspitzen (ohne genaue Form und Grösse)
-	Hinzufügen des Map-Events zum resetten der D3 Elemente nach „moveend“

**update():**
-	Genaue Form und Grösse der Marker Elemente bestimmen
-	Hinzufügen der verschiedenen Circles und Paths. Circles werden immer dann gezeichnet, wenn die Option „verschiedene Formen einblenden“ nicht aktiviert ist, oder der Betrieb vom Typ „Viehmarkt“ ist. Ansonsten werden Paths gewählt. 
Circle-, bzw. PathFromFarm ist jeweils der Betrieb, von dem eine Tierbewegung aus geht, Circle-, bzw. PathToFarm ist der Betrieb, zu dem die Tiere gelangen. 
-	Hinzufügen der ToolTips. 
-	Entfernen der Circles und Paths bei Exit der jeweiligen (z.B. wegen dynamischem Einschränken mittels Filter, ändern der Einstellungen)
-	Schutz- und Überwachungszonen sowie Pfeile hinzufügen und entfernen  

**reset():**
-	Grösse des SVG Elements bestimmen
-	Transformieren der g Elemente
-	Platzieren der Elemente entsprechende ihrer Koordinaten (Circles, Paths, Arrows)
-	Bestimmen der Position und Grösse der Schutz- und Überwachungszonen
-	Alle Betriebe einzeichnen wenn die entsprechende Einstellung gewählt wurde
