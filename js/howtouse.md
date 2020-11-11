## Elenco delle classi richiamate da <span style="color:red">.JS</span> e come riutilizzarle

1. impostare in name
2. impostare il data-require per le checkbox alternate o di gruppo (es. fieldset 6)
3. per le select del questionario impostare il data-acquire 
4. impostare il data-select="one"
5. impostare gli input nascosti
6. per ogni hidden input impostare name="questionario" data-acquire="true" data-question="dx"
7. il pulsante continua necessita di name="continua" data-access="denied"
8. negli input obbligatori è necessario usare una delle classi input-control, checkbox-control, select-control
9. gli input diversi da checkbox necessitano del data-acquire="true" sull'elemento input
10. nelle checkbox di gruppo è importante il name che verrà salvato nell'input hidden come value


## Elenco degli attributi richiamati da <span style="color:red">.JS</span> e come riutilizzarli