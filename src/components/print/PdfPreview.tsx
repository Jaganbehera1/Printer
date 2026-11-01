import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Minus, Plus, Scan, X } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

interface PdfPreviewProps {
  file: File;
  currentPage: number;
  onPageChange: (page: number) => void;
  onDocumentReady: (pageCount: number) => void;
}

export default function PdfPreview({ file, currentPage, onPageChange, onDocumentReady }: PdfPreviewProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const documentRef = useRef<PDFDocumentProxy | null>(null);
  const activeRenderTaskRef = useRef<RenderTask | null>(null);
  const renderQueueRef = useRef<Promise<void>>(Promise.resolve());
  const [pageCount, setPageCount] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let active = true;
    let loadingTask: PDFDocumentLoadingTask | null = null;
    setLoading(true);
    setError(null);
    setPageCount(0);
    documentRef.current = null;

    const loadPdf = async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
        loadingTask = pdfjs.getDocument({ data: await file.arrayBuffer() });
        const document = await loadingTask.promise;
        if (!active) return;
        documentRef.current = document;
        setPageCount(document.numPages);
        onDocumentReady(document.numPages);
        setLoading(false);
      } catch {
        if (active) {
          setError('This PDF could not be opened. Try choosing the file again or upload another PDF.');
          setLoading(false);
          onDocumentReady(0);
        }
      }
    };

    void loadPdf();
    return () => {
      active = false;
      documentRef.current = null;
      if (loadingTask) void loadingTask.destroy();
    };
  }, [file, onDocumentReady]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      const style = window.getComputedStyle(stage);
      setStageSize({
        width:
          stage.clientWidth -
          Number.parseFloat(style.paddingLeft) -
          Number.parseFloat(style.paddingRight),
        height: Math.max(280, Math.min(window.innerHeight * 0.62, 680)),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [isFullscreen]);

  useEffect(() => {
    const document = documentRef.current;
    const canvas = canvasRef.current;
    if (!document || !canvas || stageSize.width === 0 || currentPage > pageCount) return;

    let active = true;
    let renderTask: RenderTask | null = null;
    const renderPage = async () => {
      try {
        const page = await document.getPage(currentPage);
        if (!active) return;
        const baseViewport = page.getViewport({ scale: 1 });
        const fitScale = Math.min(stageSize.width / baseViewport.width, stageSize.height / baseViewport.height);
        const viewport = page.getViewport({ scale: Math.max(0.1, fitScale * zoom) });
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.ceil(viewport.width * pixelRatio);
        canvas.height = Math.ceil(viewport.height * pixelRatio);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas rendering is not available.');
        renderTask = page.render({
          canvas,
          canvasContext: context,
          viewport,
          transform: pixelRatio === 1 ? undefined : [pixelRatio, 0, 0, pixelRatio, 0, 0],
        });
        activeRenderTaskRef.current = renderTask;
        await renderTask.promise;
      } finally {
        if (renderTask && renderTask === activeRenderTaskRef.current) activeRenderTaskRef.current = null;
      }
    };

    const renderOperation = renderQueueRef.current.then(async () => {
      if (!active) return;
      const previousTask = activeRenderTaskRef.current;
      if (previousTask) {
        previousTask.cancel();
        try {
          await previousTask.promise;
        } catch (renderError) {
          if (!(renderError instanceof Error && renderError.name === 'RenderingCancelledException')) throw renderError;
        }
      }
      if (!active) return;
      await renderPage();
    });
    const queuedRender = renderOperation.catch((renderError: unknown) => {
      if (active && !(renderError instanceof Error && renderError.name === 'RenderingCancelledException')) {
        setError('This page could not be rendered. Try another PDF.');
      }
    });
    renderQueueRef.current = queuedRender;
    return () => {
      active = false;
      renderTask?.cancel();
    };
  }, [currentPage, pageCount, stageSize, zoom]);

  const changePage = (page: number) => onPageChange(Math.min(pageCount, Math.max(1, page)));

  return (
    <section
      className={`min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm ${
        isFullscreen ? 'fixed inset-0 z-50 flex flex-col rounded-none p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pt-[max(1.25rem,env(safe-area-inset-top))]' : ''
      }`}
      aria-label="PDF preview"
    >
      <div className="flex min-h-14 items-center justify-between gap-2 border-b border-neutral-100 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <Scan className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-neutral-900">PDF preview</h2>
            <p className="text-xs text-neutral-500">
              {pageCount > 0 ? `${pageCount} ${pageCount === 1 ? 'page' : 'pages'}` : 'Preparing document'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsFullscreen((previous) => !previous)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100"
          aria-label={isFullscreen ? 'Exit fullscreen preview' : 'Open fullscreen preview'}
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </button>
      </div>

      <div
        ref={stageRef}
        className={`relative flex min-h-[18rem] items-center justify-center overflow-auto bg-neutral-100 px-2 py-4 sm:px-5 ${
          isFullscreen ? 'min-h-0 flex-1' : 'h-[min(62vh,42.5rem)]'
        }`}
      >
        {loading && (
          <div className="flex flex-col items-center gap-3 text-sm text-neutral-600" role="status">
            <Spinner className="h-8 w-8 text-primary-700" />
            Loading your PDF…
          </div>
        )}
        {error && (
          <div className="mx-4 max-w-sm rounded-xl border border-error-200 bg-white p-4 text-center text-sm text-error-800" role="alert">
            <p>{error}</p>
            {isFullscreen && (
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                <X className="h-4 w-4" /> Close preview
              </button>
            )}
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={`max-w-none border border-neutral-200 bg-white shadow-md ${loading || error ? 'hidden' : ''}`}
          aria-label={`PDF page ${currentPage} of ${pageCount}`}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => changePage(currentPage - 1)}
            disabled={loading || currentPage <= 1}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-[5rem] text-center text-sm font-semibold tabular-nums text-neutral-700" aria-live="polite">
            {pageCount ? `${currentPage} / ${pageCount}` : '— / —'}
          </span>
          <button
            type="button"
            onClick={() => changePage(currentPage + 1)}
            disabled={loading || currentPage >= pageCount}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((previous) => Math.max(0.6, Math.round((previous - 0.2) * 10) / 10))}
            disabled={loading || zoom <= 0.6}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            disabled={loading}
            className="flex h-11 items-center gap-1 rounded-xl px-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
            aria-label="Fit to screen"
          >
            <Scan className="h-4 w-4" /> Fit
          </button>
          <button
            type="button"
            onClick={() => setZoom((previous) => Math.min(2, Math.round((previous + 0.2) * 10) / 10))}
            disabled={loading || zoom >= 2}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-700 hover:bg-neutral-100 disabled:opacity-40"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
