/* i18n.js - language switcher (globe icon). Translates the interface by exact-text lookup after every render, so other modules stay in English.
   Languages: en (default), tr, fr, de, es, ar (right-to-left), it. Text without an entry (long explanations, quiz, result lines) stays in English. Choice is saved in localStorage. */
(function (SH) {
  'use strict';
  const L = ['en', 'tr', 'fr', 'de', 'es', 'ar', 'it'];
  const NAMES = { en: 'English', tr: 'Türkçe', fr: 'Français', de: 'Deutsch', es: 'Español', ar: 'العربية', it: 'Italiano' };
  const LKEY = 'spacehealth.lang';
  // rows: [en, tr, fr, de, es, ar, it]
  const D = [
    ['Self-assessment dashboard for crew health during space missions', 'Uzay görevlerinde mürettebat sağlığı için öz değerlendirme panosu', 'Tableau de bord d\'auto-évaluation de la santé de l\'équipage en mission spatiale', 'Selbstbewertungs-Dashboard für die Gesundheit der Crew auf Weltraummissionen', 'Panel de autoevaluación de la salud de la tripulación en misiones espaciales', 'لوحة تقييم ذاتي لصحة الطاقم خلال المهام الفضائية', 'Dashboard di autovalutazione della salute dell\'equipaggio nelle missioni spaziali'],
    ['This tool is for demonstration and is not a medical diagnosis.', 'Bu araç yalnızca gösterim amaçlıdır ve tıbbi tanı değildir.', 'Cet outil est une démonstration et ne constitue pas un diagnostic médical.', 'Dieses Tool dient nur der Demonstration und ist keine medizinische Diagnose.', 'Esta herramienta es solo una demostración y no es un diagnóstico médico.', 'هذه الأداة للعرض التوضيحي فقط وليست تشخيصًا طبيًا.', 'Questo strumento è una dimostrazione e non è una diagnosi medica.'],
    ['All sample data is synthetic (no real astronaut data). Numeric thresholds are illustrative general reference ranges chosen by our team, not official clinical or NASA thresholds.', 'Tüm örnek veriler sentetiktir (gerçek astronot verisi yoktur). Sayısal eşikler ekibimizin seçtiği örnek genel referans aralıklarıdır; resmî klinik veya NASA eşikleri değildir.', 'Toutes les données d\'exemple sont synthétiques (aucune donnée d\'astronaute réelle). Les seuils sont des plages de référence générales illustratives choisies par notre équipe, pas des seuils cliniques ou NASA officiels.', 'Alle Beispieldaten sind synthetisch (keine echten Astronautendaten). Die Schwellenwerte sind von unserem Team gewählte, beispielhafte Referenzbereiche, keine offiziellen klinischen oder NASA-Werte.', 'Todos los datos de ejemplo son sintéticos (sin datos reales de astronautas). Los umbrales son rangos de referencia ilustrativos elegidos por nuestro equipo, no umbrales clínicos ni oficiales de la NASA.', 'جميع البيانات التجريبية اصطناعية (لا توجد بيانات رواد فضاء حقيقية). الحدود الرقمية نطاقات مرجعية توضيحية اختارها فريقنا وليست حدودًا سريرية أو رسمية من ناسا.', 'Tutti i dati di esempio sono sintetici (nessun dato reale di astronauti). Le soglie sono intervalli di riferimento illustrativi scelti dal nostro team, non soglie cliniche o ufficiali NASA.'],
    ['Min size (px):', 'Min. boyut (px):', 'Taille min. (px) :', 'Mindestgröße (px):', 'Tamaño mín. (px):', 'الحد الأدنى للحجم (px):', 'Dim. minima (px):'],
    ['Cells are:', 'Hücreler:', 'Les cellules sont :', 'Zellen sind:', 'Las células son:', 'الخلايا تكون:', 'Le cellule sono:'],
    ['Dashboard', 'Pano', 'Tableau de bord', 'Übersicht', 'Panel', 'لوحة التحكم', 'Dashboard'],
    ['Measurements', 'Ölçümler', 'Mesures', 'Messwerte', 'Mediciones', 'القياسات', 'Misurazioni'],
    ['Trends', 'Eğilimler', 'Tendances', 'Trends', 'Tendencias', 'الاتجاهات', 'Tendenze'],
    ['Image lab', 'Görüntü lab.', 'Labo d\'image', 'Bildlabor', 'Lab. de imagen', 'مختبر الصور', 'Lab. immagini'],
    ['Export', 'Dışa aktar', 'Export', 'Export', 'Exportar', 'تصدير', 'Esporta'],
    ['Sources', 'Kaynaklar', 'Sources', 'Quellen', 'Fuentes', 'المصادر', 'Fonti'],
    ['Team', 'Takım', 'Équipe', 'Team', 'Equipo', 'الفريق', 'Team'],
    ['Location', 'Konum', 'Lieu', 'Standort', 'Ubicación', 'الموقع', 'Sede'],
    ['Contact', 'İletişim', 'Contact', 'Kontakt', 'Contacto', 'التواصل', 'Contatti'],
    ['Add a measurement', 'Ölçüm ekle', 'Ajouter une mesure', 'Messwert hinzufügen', 'Añadir una medición', 'إضافة قياس', 'Aggiungi una misurazione'],
    ['Indicators', 'Göstergeler', 'Indicateurs', 'Indikatoren', 'Indicadores', 'المؤشرات', 'Indicatori'],
    ['Body map', 'Vücut haritası', 'Carte du corps', 'Körperkarte', 'Mapa corporal', 'خريطة الجسم', 'Mappa del corpo'],
    ['Mission environment', 'Görev ortamı', 'Environnement de mission', 'Missionsumgebung', 'Entorno de misión', 'بيئة المهمة', 'Ambiente di missione'],
    ['Demo mode', 'Demo modu', 'Mode démo', 'Demo-Modus', 'Modo demo', 'وضع العرض', 'Modalità demo'],
    ['Export and data', 'Dışa aktar ve veri', 'Export et données', 'Export und Daten', 'Exportar y datos', 'التصدير والبيانات', 'Esporta e dati'],
    ['Add measurement', 'Ölçüm ekle', 'Ajouter', 'Hinzufügen', 'Añadir', 'إضافة', 'Aggiungi'],
    ['Indicator', 'Gösterge', 'Indicateur', 'Indikator', 'Indicador', 'المؤشر', 'Indicatore'],
    ['Value', 'Değer', 'Valeur', 'Wert', 'Valor', 'القيمة', 'Valore'],
    ['Download CSV', 'CSV indir', 'Télécharger le CSV', 'CSV herunterladen', 'Descargar CSV', 'تنزيل CSV', 'Scarica CSV'],
    ['Print summary', 'Özeti yazdır', 'Imprimer le résumé', 'Zusammenfassung drucken', 'Imprimir resumen', 'طباعة الملخص', 'Stampa riepilogo'],
    ['Reset data', 'Verileri sıfırla', 'Réinitialiser les données', 'Daten zurücksetzen', 'Restablecer datos', 'إعادة ضبط البيانات', 'Reimposta dati'],
    ['Start check-in', 'Kontrole başla', 'Démarrer le bilan', 'Check-in starten', 'Iniciar control', 'بدء الفحص', 'Avvia check-in'],
    ['Dismiss for today', 'Bugün için kapat', 'Ignorer aujourd\'hui', 'Heute ausblenden', 'Descartar por hoy', 'إخفاء لليوم', 'Nascondi per oggi'],
    ['Restore default sample', 'Varsayılan örneği geri yükle', 'Restaurer l\'exemple par défaut', 'Standardbeispiel wiederherstellen', 'Restaurar ejemplo predeterminado', 'استعادة العينة الافتراضية', 'Ripristina esempio predefinito'],
    ['Hazard Shields', 'Tehlike Kalkanları', 'Boucliers de risques', 'Gefahrenschilde', 'Escudos de riesgo', 'دروع المخاطر', 'Scudi di rischio'],
    ['Rank', 'Rütbe', 'Grade', 'Rang', 'Rango', 'الرتبة', 'Grado'],
    ['Today’s tasks', 'Bugünün görevleri', 'Tâches du jour', 'Heutige Aufgaben', 'Tareas de hoy', 'مهام اليوم', 'Compiti di oggi'],
    ['Shield badges', 'Kalkan rozetleri', 'Badges des boucliers', 'Schild-Abzeichen', 'Insignias de escudos', 'شارات الدروع', 'Badge degli scudi'],
    ['Run 7-day simulation (demo)', '7 günlük simülasyonu çalıştır (demo)', 'Lancer la simulation de 7 jours (démo)', '7-Tage-Simulation starten (Demo)', 'Ejecutar simulación de 7 días (demo)', 'تشغيل محاكاة 7 أيام (عرض)', 'Avvia simulazione di 7 giorni (demo)'],
    ['Clear shield progress', 'Kalkan ilerlemesini sil', 'Effacer la progression', 'Schild-Fortschritt löschen', 'Borrar progreso de escudos', 'مسح تقدم الدروع', 'Cancella progressi scudi'],
    ['Gravity fields', 'Yerçekimi alanları', 'Champs de gravité', 'Schwerkraftfelder', 'Campos gravitatorios', 'مجالات الجاذبية', 'Campi gravitazionali'],
    ['Isolation and confinement', 'İzolasyon ve kapalı alan', 'Isolement et confinement', 'Isolation und Beengtheit', 'Aislamiento y confinamiento', 'العزلة والحبس', 'Isolamento e confinamento'],
    ['Hostile closed environments', 'Düşmanca kapalı ortamlar', 'Environnements clos hostiles', 'Feindliche geschlossene Umgebungen', 'Entornos cerrados hostiles', 'البيئات المغلقة المعادية', 'Ambienti chiusi ostili'],
    ['Distance from Earth', 'Dünya’dan uzaklık', 'Distance de la Terre', 'Entfernung von der Erde', 'Distancia de la Tierra', 'البعد عن الأرض', 'Distanza dalla Terra'],
    ['Space radiation', 'Uzay radyasyonu', 'Rayonnement spatial', 'Weltraumstrahlung', 'Radiación espacial', 'الإشعاع الفضائي', 'Radiazione spaziale'],
    ['Cadet', 'Kadet', 'Cadet', 'Kadett', 'Cadete', 'طالب', 'Cadetto'],
    ['Specialist', 'Uzman', 'Spécialiste', 'Spezialist', 'Especialista', 'أخصائي', 'Specialista'],
    ['Officer', 'Subay', 'Officier', 'Offizier', 'Oficial', 'ضابط', 'Ufficiale'],
    ['Commander', 'Komutan', 'Commandant', 'Kommandant', 'Comandante', 'قائد', 'Comandante'],
    ['Exercise session (about 30 min)', 'Egzersiz seansı (yaklaşık 30 dk)', 'Séance d\'exercice (environ 30 min)', 'Trainingseinheit (ca. 30 Min.)', 'Sesión de ejercicio (unos 30 min)', 'جلسة تمرين (حوالي 30 دقيقة)', 'Sessione di esercizio (circa 30 min)'],
    ['Posture and stretch break', 'Duruş ve esneme molası', 'Pause posture et étirements', 'Haltungs- und Dehnpause', 'Pausa de postura y estiramientos', 'استراحة للوضعية والتمدد', 'Pausa per postura e stretching'],
    ['Log your mood (auto)', 'Ruh halini kaydet (otomatik)', 'Notez votre humeur (auto)', 'Stimmung eintragen (auto)', 'Registra tu ánimo (auto)', 'سجّل مزاجك (تلقائي)', 'Registra l\'umore (auto)'],
    ['Log your sleep (auto)', 'Uykunu kaydet (otomatik)', 'Notez votre sommeil (auto)', 'Schlaf eintragen (auto)', 'Registra tu sueño (auto)', 'سجّل نومك (تلقائي)', 'Registra il sonno (auto)'],
    ['Talk with a crewmate', 'Bir mürettebat arkadaşıyla konuş', 'Parler avec un équipier', 'Mit einem Crewmitglied sprechen', 'Hablar con un compañero', 'تحدّث مع زميل في الطاقم', 'Parla con un compagno di equipaggio'],
    ['Log water intake', 'Su tüketimini kaydet', 'Noter l\'eau bue', 'Wasseraufnahme eintragen', 'Registrar agua bebida', 'سجّل شرب الماء', 'Registra l\'acqua bevuta'],
    ['Log a balanced meal', 'Dengeli bir öğün kaydet', 'Noter un repas équilibré', 'Ausgewogene Mahlzeit eintragen', 'Registrar una comida equilibrada', 'سجّل وجبة متوازنة', 'Registra un pasto equilibrato'],
    ['Enter all 5 measurements (auto)', '5 ölçümü de gir (otomatik)', 'Saisir les 5 mesures (auto)', 'Alle 5 Messwerte eingeben (auto)', 'Introducir las 5 mediciones (auto)', 'أدخل القياسات الخمسة (تلقائي)', 'Inserisci le 5 misure (auto)'],
    ['Read the radiation info card', 'Radyasyon bilgi kartını oku', 'Lire la fiche sur le rayonnement', 'Strahlungs-Infokarte lesen', 'Leer la ficha de radiación', 'اقرأ بطاقة معلومات الإشعاع', 'Leggi la scheda sulla radiazione'],
    ['Answer a mini quiz question', 'Mini quiz sorusunu cevapla', 'Répondre à une question du mini-quiz', 'Eine Mini-Quizfrage beantworten', 'Responder una pregunta del minicuestionario', 'أجب عن سؤال في الاختبار المصغر', 'Rispondi a una domanda del mini quiz'],
    ['ISS mission: review the day plan', 'ISS görevi: gün planını gözden geçir', 'Mission ISS : revoir le plan du jour', 'ISS-Mission: Tagesplan prüfen', 'Misión ISS: revisar el plan del día', 'مهمة المحطة: راجع خطة اليوم', 'Missione ISS: rivedi il piano del giorno'],
    ['Moon mission: dust-control check', 'Ay görevi: toz kontrolü', 'Mission Lune : contrôle de la poussière', 'Mond-Mission: Staubkontrolle', 'Misión Luna: control del polvo', 'مهمة القمر: فحص الغبار', 'Missione Luna: controllo della polvere'],
    ['Mars mission: send one complete status message', 'Mars görevi: tek seferde eksiksiz durum mesajı gönder', 'Mission Mars : envoyer un message d\'état complet', 'Mars-Mission: eine vollständige Statusmeldung senden', 'Misión Marte: enviar un mensaje de estado completo', 'مهمة المريخ: أرسل رسالة حالة كاملة', 'Missione Marte: invia un messaggio di stato completo'],
    ['Image lab: cell counter (educational demo)', 'Görüntü laboratuvarı: hücre sayacı (eğitim demosu)', 'Labo d\'image : compteur de cellules (démo pédagogique)', 'Bildlabor: Zellzähler (Lehrdemo)', 'Laboratorio de imagen: contador de células (demo educativa)', 'مختبر الصور: عدّاد الخلايا (عرض تعليمي)', 'Laboratorio immagini: contatore di cellule (demo didattica)'],
    ['Educational tool inspired by NASA OSDR data models. It counts cells in a microscopy-style image with a simple threshold method. It is not a clinical measurement.', 'NASA OSDR veri modellerinden esinlenen eğitim aracı. Mikroskop tarzı bir görüntüde basit eşikleme ile hücre sayar. Klinik bir ölçüm değildir.', 'Outil pédagogique inspiré des modèles de données NASA OSDR. Il compte les cellules d\'une image de type microscopie par un simple seuillage. Ce n\'est pas une mesure clinique.', 'Lernwerkzeug, inspiriert von den Datenmodellen des NASA OSDR. Es zählt Zellen in einem mikroskopieartigen Bild per einfacher Schwellenwertmethode. Keine klinische Messung.', 'Herramienta educativa inspirada en los modelos de datos de NASA OSDR. Cuenta células en una imagen tipo microscopía con un umbral simple. No es una medición clínica.', 'أداة تعليمية مستوحاة من نماذج بيانات NASA OSDR. تعدّ الخلايا في صورة مجهرية بطريقة عتبة بسيطة. وليست قياسًا سريريًا.', 'Strumento didattico ispirato ai modelli di dati NASA OSDR. Conta le cellule in un\'immagine di tipo microscopico con una soglia semplice. Non è una misura clinica.'],
    ['Load sample image', 'Örnek görüntüyü yükle', 'Charger l\'image d\'exemple', 'Beispielbild laden', 'Cargar imagen de ejemplo', 'تحميل صورة مثال', 'Carica immagine di esempio'],
    ['Choose image:', 'Görüntü seç:', 'Choisir une image :', 'Bild wählen:', 'Elegir imagen:', 'اختر صورة:', 'Scegli immagine:'],
    ['On the ISS, radiation and microgravity can change immune cells such as lymphocytes, so cell monitoring supports routine health checks.', 'ISS’te radyasyon ve mikroyerçekimi lenfosit gibi bağışıklık hücrelerini değiştirebilir; hücre izleme rutin sağlık kontrollerini destekler.', 'Sur l\'ISS, le rayonnement et la microgravité peuvent modifier les cellules immunitaires comme les lymphocytes ; le suivi cellulaire soutient les contrôles de routine.', 'Auf der ISS können Strahlung und Mikrogravitation Immunzellen wie Lymphozyten verändern; Zellüberwachung unterstützt Routinechecks.', 'En la ISS, la radiación y la microgravedad pueden cambiar células inmunitarias como los linfocitos; el seguimiento celular apoya los controles rutinarios.', 'على المحطة الدولية قد يغيّر الإشعاع وانعدام الجاذبية الخلايا المناعية كالخلايا الليمفاوية، لذا تدعم مراقبة الخلايا الفحوص الروتينية.', 'Sulla ISS radiazione e microgravità possono modificare cellule immunitarie come i linfociti; il monitoraggio cellulare supporta i controlli di routine.'],
    ['On the Moon, radiation exposure is higher and crews rely on local checks, so simple cell monitoring helps track immune changes.', 'Ay’da radyasyon maruziyeti daha yüksektir ve ekipler yerel kontrollere dayanır; basit hücre izleme bağışıklık değişimlerini izlemeye yardım eder.', 'Sur la Lune, l\'exposition au rayonnement est plus élevée et l\'équipage s\'appuie sur des contrôles locaux ; un suivi cellulaire simple aide à suivre les changements immunitaires.', 'Auf dem Mond ist die Strahlenbelastung höher und die Crew verlässt sich auf lokale Checks; einfache Zellüberwachung hilft, Immunveränderungen zu verfolgen.', 'En la Luna la exposición a la radiación es mayor y la tripulación depende de controles locales; un seguimiento celular simple ayuda a ver cambios inmunitarios.', 'على القمر يكون التعرض للإشعاع أعلى ويعتمد الطاقم على فحوص محلية، لذا تساعد مراقبة الخلايا البسيطة على تتبع تغيّرات المناعة.', 'Sulla Luna l\'esposizione alle radiazioni è maggiore e l\'equipaggio si affida a controlli locali; un semplice monitoraggio cellulare aiuta a seguire i cambiamenti immunitari.'],
    ['On a Mars transit, messages take about 20 minutes each way, so the crew needs local, autonomous assessment before ground advice arrives.', 'Mars yolculuğunda mesajlar tek yönde yaklaşık 20 dakika sürer; ekip yer tavsiyesi gelmeden önce yerel ve özerk değerlendirme yapmalıdır.', 'Lors d\'un transit vers Mars, les messages mettent environ 20 minutes dans chaque sens ; l\'équipage doit donc évaluer seul, sur place, avant l\'avis du sol.', 'Auf einem Marsflug brauchen Nachrichten etwa 20 Minuten pro Richtung; die Crew muss daher vor dem Rat vom Boden selbstständig vor Ort bewerten.', 'En un tránsito a Marte los mensajes tardan unos 20 minutos por trayecto, así que la tripulación necesita una evaluación local y autónoma antes del consejo de tierra.', 'في رحلة المريخ تستغرق الرسائل نحو 20 دقيقة في كل اتجاه، لذا يحتاج الطاقم إلى تقييم محلي مستقل قبل وصول نصيحة الأرض.', 'Nel transito verso Marte i messaggi impiegano circa 20 minuti per tratta, quindi l\'equipaggio deve valutare in autonomia prima del consiglio da Terra.'],
    ['Start exercise', 'Egzersizi başlat', 'Démarrer l\'exercice', 'Training starten', 'Iniciar ejercicio', 'ابدأ التمرين', 'Avvia esercizio'],
    ['Choose your crew member', 'Mürettebat üyeni seç', 'Choisissez votre équipier', 'Wähle dein Crewmitglied', 'Elige a tu tripulante', 'اختر عضو الطاقم', 'Scegli il tuo membro dell\'equipaggio'],
    ['Close', 'Kapat', 'Fermer', 'Schließen', 'Cerrar', 'إغلاق', 'Chiudi'],
    ['Start (10 s)', 'Başlat (10 sn)', 'Démarrer (10 s)', 'Start (10 s)', 'Iniciar (10 s)', 'ابدأ (10 ث)', 'Avvia (10 s)'],
    ['Great job! Exercise done.', 'Harika! Egzersiz tamamlandı.', 'Bravo ! Exercice terminé.', 'Super! Training geschafft.', '¡Bien hecho! Ejercicio completado.', 'أحسنت! اكتمل التمرين.', 'Ottimo! Esercizio completato.'],
    ['ISS (0 g): raise and lower your arms against resistance', 'ISS (0 g): kolları direnç hissederek kaldır ve indir', 'ISS (0 g) : levez et baissez les bras contre la résistance', 'ISS (0 g): Arme gegen Widerstand heben und senken', 'ISS (0 g): sube y baja los brazos contra resistencia', 'المحطة (0 جـ): ارفع ذراعيك وأنزلهما ضد المقاومة', 'ISS (0 g): alza e abbassa le braccia contro resistenza'],
    ['Moon (1/6 g): slow squats', 'Ay (1/6 g): yavaş squat', 'Lune (1/6 g) : squats lents', 'Mond (1/6 g): langsame Kniebeugen', 'Luna (1/6 g): sentadillas lentas', 'القمر (1/6 جـ): قرفصاء بطيئة', 'Luna (1/6 g): squat lenti'],
    ['Mars (3/8 g): hold an isometric stance', 'Mars (3/8 g): izometrik duruşu koru', 'Mars (3/8 g) : tenez une posture isométrique', 'Mars (3/8 g): isometrische Haltung halten', 'Marte (3/8 g): mantén una postura isométrica', 'المريخ (3/8 جـ): حافظ على وضعية ثابتة', 'Marte (3/8 g): mantieni una posizione isometrica'],
    ['Woman astronaut', 'Kadın astronot', 'Astronaute femme', 'Astronautin', 'Astronauta mujer', 'رائدة فضاء', 'Astronauta donna'],
    ['Man astronaut', 'Erkek astronot', 'Astronaute homme', 'Astronaut', 'Astronauta hombre', 'رائد فضاء', 'Astronauta uomo'],
    ['EVA suit astronaut', 'EVA kıyafetli astronot', 'Astronaute en combinaison EVA', 'Astronaut im EVA-Anzug', 'Astronauta con traje EVA', 'رائد بزي المهام الخارجية', 'Astronauta in tuta EVA'],
    ['Friendly alien coach', 'Dost uzaylı koç', 'Coach extraterrestre sympa', 'Freundlicher Alien-Coach', 'Entrenador alienígena amigable', 'مدرب فضائي ودود', 'Coach alieno amichevole']
  ];
  const MAP = {}; D.forEach(function (r) { MAP[r[0]] = r; });
  const origText = new WeakMap(), origAttr = new WeakMap();
  const ATTRS = ['aria-label', 'title'];
  let lang = 'en', menu = null, btn = null;

  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  function tr(en) { const r = MAP[norm(en)]; return (r && lang !== 'en') ? r[L.indexOf(lang)] : en; }
  function apply() {
    const root = document.body, w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const p = n.parentNode;
      if (p && (p.nodeName === 'SCRIPT' || p.nodeName === 'STYLE' || (p.closest && p.closest('[data-no-i18n]')))) continue;
      let o = origText.get(n); if (o === undefined) { o = n.nodeValue; origText.set(n, o); }
      const r = MAP[norm(o)];
      const want = (r && lang !== 'en') ? o.replace(norm(o), r[L.indexOf(lang)]) : o;
      if (n.nodeValue !== want) n.nodeValue = want;
    }
    document.querySelectorAll('[aria-label],[title]').forEach(function (e) {
      if (e.closest('[data-no-i18n]')) return;
      let o = origAttr.get(e); if (!o) { o = {}; origAttr.set(e, o); }
      ATTRS.forEach(function (a) {
        if (!e.hasAttribute(a)) return;
        if (o[a] === undefined || (e.getAttribute(a) !== tr(o[a]) && e.getAttribute(a) !== o[a])) o[a] = e.getAttribute(a);
        const v = tr(o[a]); if (e.getAttribute(a) !== v) e.setAttribute(a, v);
      });
    });
    document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
  function set(l) {
    if (L.indexOf(l) < 0) return; lang = l; SH.storage.set(LKEY, l);
    if (menu) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); Array.prototype.forEach.call(menu.children, function (li) { li.firstChild.setAttribute('aria-checked', String(li.firstChild.dataset.l === l)); }); }
    if (SH.rerender) SH.rerender(); else apply();
  }
  function build() {
    const host = document.querySelector('.header-inner'); if (!host) return;
    const pill = host.querySelector('.pill'); if (pill) pill.remove(); // keep the header clean; the notice bar already says the data is synthetic
    const wrap = SH.dom.el('div', { class: 'lang', 'data-no-i18n': '' });
    btn = SH.dom.el('button', { type: 'button', class: 'lang-btn', 'aria-haspopup': 'true', 'aria-expanded': 'false', 'aria-label': 'Language' });
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9.5"/><ellipse cx="12" cy="12" rx="4" ry="9.5"/><path d="M2.5 12h19M4 7h16M4 17h16"/></svg>';
    menu = SH.dom.el('ul', { class: 'lang-menu', role: 'menu', hidden: true });
    L.forEach(function (l) {
      const b = SH.dom.el('button', { type: 'button', role: 'menuitemradio', 'aria-checked': String(l === lang), 'data-l': l, text: NAMES[l], lang: l, onclick: function () { set(l); btn.focus(); } });
      menu.appendChild(SH.dom.el('li', {}, [b]));
    });
    btn.addEventListener('click', function () { menu.hidden = !menu.hidden; btn.setAttribute('aria-expanded', String(!menu.hidden)); if (!menu.hidden) menu.querySelector('button').focus(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { menu.hidden = true; btn.focus(); } });
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) menu.hidden = true; });
    wrap.appendChild(btn); wrap.appendChild(menu); host.appendChild(wrap);
  }
  SH.i18n = { t: tr, set: set, apply: apply, get lang() { return lang; } };
  SH.ui.i18n = {
    init: function () { const s = SH.storage.get(LKEY, 'en'); lang = L.indexOf(s) >= 0 ? s : 'en'; build(); },
    render: apply
  };
})(window.SpaceHealth);
