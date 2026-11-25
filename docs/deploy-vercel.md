# Publikacja pilota na Vercel

Instrukcja dla właściciela projektu. Dotyczy pilota: właściciel i kilka osób testowych, wyłącznie dane fikcyjne, niewielkie skutki awarii. Stan dokumentacji Vercel sprawdzony 25.11.2026 (źródła na końcu).

## Co właściwie publikujemy

- Zwykłą stronę statyczną: pliki z katalogu `dist/` po `npm run build`.
- Bez serwera, bazy danych, kont i kluczy. Nie trzeba ustawiać żadnych zmiennych środowiskowych.
- Dane testerów zostają w ich przeglądarkach (localStorage). Hosting ich nie widzi, a nowa wersja strony ich nie usuwa.
- Adresy w aplikacji zaczynają się od `/#/`, więc Vercel nie potrzebuje pliku `vercel.json` z przekierowaniami.

## 1. Przed każdą publikacją

1. Na komputerze, w folderze projektu, uruchom kontrole:

   ```sh
   npm run format:check
   npm run design-system:check
   npm run lint
   npm run typecheck
   npm test
   npm run verify:packet
   npm run build
   ```

   Każda musi zakończyć się bez błędu. Testy przeglądarkowe (`npm run test:e2e`) wymagają przeglądarki Playwright Chromium, której na tym komputerze celowo nie instalujemy (zobacz punkt 7).

2. Wyślij zmiany na GitHub (do gałęzi `main` swojego forka). Vercel opublikuje dokładnie tę wersję. Jej identyfikator to skrót commita widoczny w Vercel przy wdrożeniu.

## 2. Pierwsze połączenie forka z Vercel (jednorazowo)

1. Zaloguj się na vercel.com (darmowy plan Hobby).
2. W prawym górnym rogu panelu kliknij **New Project**.
3. Wybierz import repozytorium z GitHuba i wskaż `doroboty-ai` na swoim koncie. Jeśli go nie widać, zezwól Vercel na dostęp do tego repozytorium.
4. Na ekranie konfiguracji sprawdź (dokumentacja nie gwarantuje, co Vercel wykryje sam, więc porównaj ręcznie):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Root Directory**: katalog główny repozytorium (bez zmian)
   - **Environment Variables**: nic nie dodawaj
5. Kliknij **Deploy** i poczekaj na koniec budowania.
6. Odtąd każda zmiana wysłana do `main` publikuje się sama. Inne gałęzie dostają osobne adresy podglądu.

## 3. Wersja Node.js — sprawdź w logu budowania

Projekt jest sprawdzany na Node.js 24. W `package.json` ma zapis `"engines": { "node": ">=24 <27" }`. Według dokumentacji Vercel ten zapis ma pierwszeństwo przed ustawieniem w panelu (Settings → Build and Deployment → Node.js Version). Dostępne wersje to 22.x, 24.x i 26.x (domyślna). Vercel może więc zbudować stronę na Node 26.

Po pierwszym wdrożeniu otwórz **Build Logs** (kafelek wdrożenia produkcyjnego na stronie projektu) i sprawdź, której wersji Node użyto.

- Jeśli 24.x: wszystko zgodnie z testami.
- Jeśli 26.x i build oraz kontrola z punktu 4 przechodzą: strona działa, ale wersja różni się od testowanej. Zapisz to w raporcie gotowości. Ustawienie na sztywno 24.x wymaga zmiany `engines` w `package.json`, czyli osobnej decyzji.

## 4. Kontrola po publikacji (5 minut)

Użyj tylko fikcyjnych person i krótkich tekstów testowych.

1. Otwórz adres produkcyjny z Vercel. Przeglądarka pokazuje kłódkę (HTTPS), a strona główna „Praca dla ludzi, którzy dowożą z AI” się ładuje.
2. **Oferty**: lista pokazuje 6 ofert, a jedna oferta otwiera się poprawnie.
3. **Wybierz osobę → Anna Kowalska** → oferta → **Aplikuj** → odpowiedź (min. 20 znaków) → zaznacz zgodę → **Wyślij aplikację**. Pojawia się komunikat „Aplikacja została wysłana”.
4. **Zmień osobę → Karolina Wiśniewska → Kandydaci** → aplikacja Anny → **W przeglądzie**.
5. Odśwież stronę (F5). Status „W przeglądzie” zostaje.
6. Otwórz stronę na telefonie. Treść mieści się na ekranie, a menu działa.

**Warunek wycofania:** jeśli strona główna jest pusta albo nie da się wysłać aplikacji lub zmienić jej statusu, od razu wróć do poprzedniej wersji (punkt 5), a dopiero potem szukaj przyczyny.

## 5. Powrót do poprzedniej wersji (Instant Rollback)

1. Na stronie projektu w Vercel, na kafelku **Production Deployment**, kliknij **Instant Rollback**.
2. Wybierz wdrożenie i kliknij **Continue**. Na planie Hobby można wrócić tylko do **bezpośrednio poprzedniego** wdrożenia.
3. Sprawdź domeny i szczegóły, a potem kliknij **Confirm Rollback**.
4. Ważne: po wycofaniu nowe zmiany z GitHuba **nie trafiają automatycznie** na produkcję, dopóki tego nie cofniesz. Gdy poprawka będzie gotowa, kliknij **Manage** na kafelku produkcji, wybierz nowe wdrożenie i potwierdź.
5. Dane testerów nie ucierpią, bo są w ich przeglądarkach. Adres strony się nie zmienia, więc zapisane scenariusze zostają.

Alternatywa: zakładka **Deployments**, filtr `main`, menu ⋮ przy wdrożeniu, **Instant Rollback**.

## 6. Gdy coś nie działa — pierwsze kroki

Reaguje właściciel projektu. Testerzy zgłaszają problemy kanałem ustalonym przy wysyłaniu linku (do uzupełnienia przez właściciela; nie wpisuj tu prywatnych danych kontaktowych).

1. **Czy problem dotyczy wszystkich?** Otwórz stronę sam, w oknie prywatnym.
2. **Jeśli strona nie działa u nikogo**, a ostatnio była publikacja: wykonaj punkt 5 (powrót do poprzedniej wersji) i sprawdź **Build Logs** ostatniego wdrożenia.
3. **Jeśli problem jest tylko u jednego testera** (np. ekran „Coś poszło nie tak” albo komunikat o nieczytelnym zapisie): poproś go o **Ustawienia → pobranie kopii danych**, a potem **Resetuj scenariusz**. Nie proś o przesłanie prawdziwych danych osobowych.
4. **Poinformuj testerów** krótko, co się stało i kiedy mogą wrócić.
5. Zapisz, co się stało i co pomogło (np. w `docs/tasks/`).

Logi działania strony są w Vercel przechowywane na planie Hobby tylko przez 1 godzinę. Logi budowania są przechowywane bezterminowo.

## 7. Limity darmowego planu i testy automatyczne

- Plan Hobby jest darmowy. Miesięcznie obejmuje m.in. 100 GB transferu (Fast Data Transfer) i 1 000 000 zapytań CDN. Po przekroczeniu limitu dokumentacja mówi o czekaniu do końca 30 dni, a nie o opłatach. Nie podpinaj karty.
- Jedno wejście na stronę to kilkaset kB, więc pilot z kilkoma osobami zużyje ułamek procenta limitu.
- Vercel Hobby nie ma wbudowanych powiadomień o niedostępności strony. Ustalimy je przy drugim przebiegu audytu, po wdrożeniu.
- Testy przeglądarkowe można uruchamiać bez instalowania czegokolwiek na komputerze: na stronie forka na GitHubie otwórz zakładkę **Actions** i włącz workflowy. GitHub uruchomi wtedy pełną kontrolę (`.github/workflows/ci.yml`) na swoich serwerach przy każdej zmianie.

## Źródła (dokumentacja Vercel, odczyt 25.11.2026)

- Import repozytorium: https://vercel.com/docs/git
- Vite na Vercel: https://vercel.com/docs/frameworks/frontend/vite
- Wersje Node.js: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- Instant Rollback: https://vercel.com/docs/instant-rollback
- Plan Hobby: https://vercel.com/docs/plans/hobby
- Limity: https://vercel.com/docs/limits
- Logi: https://vercel.com/docs/deployments/logs
