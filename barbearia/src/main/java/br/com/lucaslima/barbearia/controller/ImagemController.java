package br.com.lucaslima.barbearia.controller;

import br.com.lucaslima.barbearia.dto.ImagemSlotDTO;
import br.com.lucaslima.barbearia.model.ImagemSite;
import br.com.lucaslima.barbearia.security.CurrentUserService;
import br.com.lucaslima.barbearia.service.ImagemSiteService;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/imagens")
public class ImagemController {

    private final ImagemSiteService imagemSiteService;
    private final CurrentUserService currentUserService;

    public ImagemController(ImagemSiteService imagemSiteService, CurrentUserService currentUserService) {
        this.imagemSiteService = imagemSiteService;
        this.currentUserService = currentUserService;
    }

    // protegido: o painel usa pra saber quais espaços já têm foto
    @GetMapping
    public ResponseEntity<List<ImagemSlotDTO>> listarSlots() {
        return ResponseEntity.ok(imagemSiteService.listarSlots());
    }

    // público: é o que vira o src="" da <img> na landing page
    @GetMapping("/{slot}")
    public ResponseEntity<byte[]> buscar(@PathVariable String slot) {
        ImagemSite imagem = imagemSiteService.buscar(slot);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(imagem.getContentType()))
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
                .body(imagem.getConteudo());
    }

    // protegido: só o dono troca as fotos do site
    @PostMapping(value = "/{slot}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> salvar(@PathVariable String slot, @RequestParam("arquivo") MultipartFile arquivo) {
        exigirDono();
        imagemSiteService.salvar(slot, arquivo);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{slot}")
    public ResponseEntity<Void> remover(@PathVariable String slot) {
        exigirDono();
        imagemSiteService.remover(slot);
        return ResponseEntity.noContent().build();
    }

    private void exigirDono() {
        if (!currentUserService.getBarbeiroAutenticado().isDono()) {
            throw new AccessDeniedException("Somente o dono pode alterar as imagens do site");
        }
    }
}
