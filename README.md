# Luchsi1.github.io

subnationale einheiten ("Bundesländer", autonome Regionen etc):
https://de.wikipedia.org/wiki/Wikipedia:Vorlagen_subnationaler_Einheiten_mit_Flagge



convert svg to png:
Get-ChildItem *.svg | ForEach-Object {
    inkscape $_.FullName --export-type=png --export-width=1024
}
(nur der ordner der im terminal offen ist)

Get-ChildItem -Recurse -Filter *.svg | ForEach-Object {
    inkscape $_.FullName --export-type=png --export-width=1024
}
(auch unterordner)

(vorher inkscape runterladen) (https://inkscape.org/release/1.4.4/windows/)
(die svgs in einen ordner packen, dann diesen ordner im terminal öffnen, dann command einfügen und ausführen)


convert webp to png:
Get-ChildItem *.webp | % { magick $_.FullName "$($_.BaseName).png" }
(nur der ordner der im terminal offen ist)

Get-ChildItem -Recurse -Filter *.webp | ForEach-Object {
    magick $_.FullName "$($_.DirectoryName)\$($_.BaseName).png"
}
(auch unterordner)

(vorher ImageMagick runterladen) (https://imagemagick.org/download/#windows)
(ausführen, wie bei svg to png)





todos:
-first-level subdivisions for every country
-autonomous regions
-redo quizes to be expandable (quiz not via quiz_type but via option_type and answer_type)
-change options to be able to do quiz-rework
-for history tab:
    -wars
    -maps of the world
